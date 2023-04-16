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

import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { Row, Input, Col } from 'reactstrap';
import CustomInput from './CustomInput';

const LabeledInput = ({
    name,
    label,
    type = 'text',
    required = false,
    labelClassName = '',
    // fieldClassName = '',
    placeholder = '',
    surroundInput = c => c,
    colSize = '',
    autoComplete = 'on',
}) => {
    const { t } = useTranslation();
    return surroundInput(
      <>
        <Row className="standard-padding">
          <span className={labelClassName}>{`${t(label) + (required ? '*' : '')}:`}</span>
          <br />
        </Row>
        <Row>
          <Col xs={colSize}>
            <Input
              tag={Field}
              name={name}
              type={type}
              component={CustomInput}
              placeholder={t(placeholder)}
              autoComplete={autoComplete}
            />
          </Col>
        </Row>
      </>,
    );
};

LabeledInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    type: PropTypes.string,
    colSize: PropTypes.string,
    labelClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    errorClassName: PropTypes.string,
    placeholder: PropTypes.string,
    surroundInput: PropTypes.func,
    autoComplete: PropTypes.string,
};

export default LabeledInput;
