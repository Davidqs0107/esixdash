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
import { FormikConsumer, Field } from 'formik';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { util } from '@e6tech/common';
import CustomSelect from './CustomSelect';

const { resolveObjectProperty } = util;

const SelectFromList = ({
    name,
    label,
    required = false,
    labelClassName = '',
    fieldClassName = 'text-capitalize',
    surroundInput = c => c,
    valueMapper = v => v,
    displayMapper = d => d,
    loading = false,
    defaultText,
    list = [],
    colSize = '',
}) => {
    const { t } = useTranslation();

    return surroundInput(
      <>
        <div>
          <Row className="standard-padding">
            <span className={labelClassName}>{`${t(label) + (required ? '*' : '')}:`}</span>
          </Row>
          {!loading ? (
            <Row>
              <Col xs={colSize}>
                <Field type="select" tag={Field} className={fieldClassName} component={CustomSelect} name={name}>
                  {defaultText
                      ? (
                        <option value="" key={t(defaultText)}>
                          {t(defaultText)}
                        </option>
                      ) : null}
                  {list.map(val => (
                    <option value={valueMapper(val)} key={displayMapper(val)}>
                      {displayMapper(val)}
                    </option>
                  ))}
                </Field>
              </Col>
            </Row>
          ) : null }
          <FormikConsumer>
            {({ values, setFieldValue }) => {
                // this part sets the default option if available
                if (!defaultText && !resolveObjectProperty(name, values) && list[0]) {
                    setFieldValue(name, valueMapper(list[0], false));
                }
                return null;
            }}
          </FormikConsumer>
        </div>
      </>,
    );
};


SelectFromList.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
    required: PropTypes.bool,
    type: PropTypes.string,
    colSize: PropTypes.string,
    labelClassName: PropTypes.string,
    fieldClassName: PropTypes.string,
    surroundInput: PropTypes.func,
    loading: PropTypes.bool,
};

export default SelectFromList;
