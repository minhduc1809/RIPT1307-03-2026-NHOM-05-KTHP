import DatePicker from 'antd/lib/date-picker/index';
import moment from 'moment';
import type { Moment } from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'antd/es/date-picker/style/index.less';
import type { PickerProps } from 'antd/lib/date-picker/generatePicker';

const MyDatePicker = (
  props: PickerProps<Moment> & {
    format?: string;
    saveFormat?: string;
    onChange?: (arg: string) => any;
  },
) => {
  const format = props?.format ?? 'DD/MM/YYYY';
  const { saveFormat } = props;

  const handleChange = (value: Moment | null) => {
    if (props.onChange && value)
      props.onChange(saveFormat ? value?.format(props?.saveFormat) : value.toISOString());
  };

  let objMoment: any = undefined;
  if (props.value && typeof props.value == 'string') objMoment = moment(props.value, saveFormat);

  return (
    <DatePicker
      style={{ width: '100%' }}
      {...props}
      format={format}
      locale={locale}
      value={objMoment}
      onChange={handleChange}
    />
  );
};

export default MyDatePicker;
