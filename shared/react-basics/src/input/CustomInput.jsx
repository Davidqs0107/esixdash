/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormFeedback } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { util } from '@e6tech/common';

const { resolveObjectProperty } = util;


const CustomInputField = ({ field, form: { touched, errors }, ...props }) => {
    const { t } = useTranslation();

    return (
      <div>
        <Input
          className="standard-margin"
          invalid={!!(resolveObjectProperty(field.name, touched) && resolveObjectProperty(field.name, errors))}
          {...field}
          {...props}
        />
        {/* eslint-disable-next-line max-len */}
        {resolveObjectProperty(field.name, touched) && resolveObjectProperty(field.name, errors) && <FormFeedback>{t(resolveObjectProperty(field.name, errors))}</FormFeedback>}
      </div>
    );
};

CustomInputField.propTypes = {
    field: PropTypes.oneOfType([PropTypes.object]).isRequired,
    form: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default CustomInputField;
