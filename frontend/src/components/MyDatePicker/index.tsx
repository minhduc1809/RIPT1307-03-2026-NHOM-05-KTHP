import DatePicker from 'antd/lib/date-picker/index';
import moment from 'moment';
import type { Moment } from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'antd/es/date-picker/style/index.less';
import type { PickerProps } from 'antd/lib/date-picker/generatePicker';

const MyDatePicker = (
  props: PickerProps<Moment> & {
    format?: string;
    sourceFormat?: string;
    onChange?: (arg: string) => any;
  },
) => {
  const format = props?.format ?? 'DD/MM/YYYY';

  const handleChange = (value: any) => {
    if (props.onChange) props.onChange(value?.format(props?.sourceFormat ?? format));
  };

  let objMoment: any = undefined;
  if (props.value && typeof props.value == 'string')
    objMoment = moment(props.value, props?.sourceFormat ?? format);

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
