import React, { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import BaseModalProps from './BaseInputModalProps';
import InputModal from './InputModal';
import Spacing from '../../constants/Spacing';
import {
    CURRENT_WEIGHT_MODAL_BODY,
    CURRENT_WEIGHT_MODAL_BUTTON,
    CURRENT_WEIGHT_MODAL_ERROR,
    CURRENT_WEIGHT_MODAL_TITLE,
    TOAST_WEIGHT_UPDATED,
} from '../../constants/Strings';
import { getLastRecordedWeightSelector } from '../../selectors/UserInfoSelector';
import LocalStore from '../../store/LocalStore';
import { addWeightEntry } from '../../store/userInfo/UserInfoActions';
import { useStyleTheme } from '../../styles/Theme';
import { isNumber } from '../../utility/TextUtility';
import { showToast } from '../toast/util/ShowToast';

const WeightEntryModal = (props: BaseModalProps) => {
    const { isVisible, onDismissed } = props;

    const currentDate = useSelector<LocalStore, string>((state: LocalStore) => state.userInfo.currentDate);
    const lastWeightEntry = useSelector<LocalStore, string>((state: LocalStore) => getLastRecordedWeightSelector(state));

    const [value, setValue] = useState(lastWeightEntry);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setValue(lastWeightEntry);
    }, [lastWeightEntry]);

    const dispatch = useDispatch();

    const onPrimaryButtonPressed = () => {
        const intVal = parseInt(value, 10);
        if (!isNumber(value) || intVal === 0) {
            setShowError(true);
            return;
        }

        onDismissed();
        setShowError(false);

        dispatch(addWeightEntry(currentDate, intVal));
        showToast('success', TOAST_WEIGHT_UPDATED, value);
    };

    return (
        <InputModal
            title={CURRENT_WEIGHT_MODAL_TITLE}
            subtitle={CURRENT_WEIGHT_MODAL_BODY}
            icon={(
                <FontAwesome5
                    name="weight"
                    size={96}
                    style={{ alignSelf: 'center', marginBottom: Spacing.X_SMALL }}
                    color={useStyleTheme().colors.secondaryLighter}
                />
            )}
            value={value}
            isVisible={isVisible}
            onCancel={onDismissed}
            buttonText={CURRENT_WEIGHT_MODAL_BUTTON}
            onChangeText={setValue}
            showError={showError}
            errorMessage={CURRENT_WEIGHT_MODAL_ERROR}
            keyboardType="number-pad"
            maxInputLength={3}
            onButtonPressed={onPrimaryButtonPressed}
        />
    );
};

export default WeightEntryModal;
