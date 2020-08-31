import { changeLocalSetting } from 'actions/settings';
import FilePathAutoPicker from 'components/FilePathAutoPicker';
import CheckboxField from 'components/Form/Checkbox';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSetting } from 'selectors/settings';

import ModalButtons from '../../Buttons';
import PageHeader from '../../PageHeader';

const DownloadSettings = () => {
  const dispatch = useDispatch();
  const downloadPath = useSelector(getSetting('downloadPath'));

  const initialValues = {
    downloadPath: downloadPath,
    moveWhenCompleted: false,
  };

  const onSubmit = (values: typeof initialValues) => {
    const formDownloadPath = values.downloadPath;
    dispatch(changeLocalSetting('downloadPath', formDownloadPath));
  };

  return (
    <div>
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {props => (
          // eslint-disable-next-line react/prop-types
          <form onSubmit={props.handleSubmit}>
            <PageHeader title="Download Settings" subtitle="Options that control what happens to downloaded files" />
            <Field name="downloadPath">
              {field => (
                <FilePathAutoPicker
                  initialValue={field.input.value}
                  label="Download path"
                  onChange={field.input.onChange}
                />
              )}
            </Field>

            <CheckboxField name="moveWhenCompleted" label="Move on complete" />
            <Field name="completedPath">
              {field => (
                <FilePathAutoPicker
                  // eslint-disable-next-line react/prop-types
                  fieldProps={{ disabled: !props.values.moveWhenCompleted }}
                  label="Completed path"
                  initialValue={field.input.value}
                  onChange={field.input.onChange}
                />
              )}
            </Field>
            <ModalButtons />
          </form>
        )}
      </Form>
    </div>
  );
};

export default DownloadSettings;
