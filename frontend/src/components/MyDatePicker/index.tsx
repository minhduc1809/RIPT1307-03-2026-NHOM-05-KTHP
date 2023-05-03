import DatePicker from 'antd/lib/date-picker/index';
import moment from 'moment';
import type { Moment } from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import 'antd/es/date-picker/style/index.less';
import type { PickerProps } from 'antd/lib/date-picker/generatePicker';

const MyDatePicker = (
  props: PickerProps<Moment> & {
    format?: string;
    pickerStyle?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
    saveFormat?: string;
    allowClear?: boolean;
    disabledDate?: (cur: string) => any;
    onChange?: (arg: string | null) => any;
  },
) => {
  const format = props?.format ?? 'DD/MM/YYYY';
  const { saveFormat, pickerStyle, allowClear } = props;

  const handleChange = (value: Moment | null) => {
    if (props.onChange)
      if (value)
        props.onChange(saveFormat ? value?.format(props?.saveFormat) : value.toISOString());
      else props.onChange(null);
  };

  let objMoment: any = undefined;
  if (props.value && typeof props.value == 'string') objMoment = moment(props.value, saveFormat);
  else objMoment = props?.value;

  return (
    <DatePicker
      style={{ width: '100%' }}
      {...props}
      format={format}
      picker={pickerStyle}
      locale={locale}
      value={objMoment}
      allowClear={allowClear}
      onChange={handleChange}
      disabledDate={props?.disabledDate}
    />
  );
};

export default MyDatePicker;
