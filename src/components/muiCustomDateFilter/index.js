"use client";

import dayjs from "dayjs";

// Components
import DatePicker from "@/components/datePicker";
import TextInput from "@/components/inputs/textInput";

const MUICustomDateFilter = (props) => {
  const { item, applyValue } = props;

  const handleDateChange = (value) =>
    applyValue({
      ...item,
      value: value ? dayjs(value).format("YYYY-MM-DD") : null,
    });

  return (
    <DatePicker
      pickerProps={{
        format: "DD-MM-YYYY",
        onChange: handleDateChange,
        sx: { margin: "0 0 !important" },
        value: item.value ? dayjs(item.value) : null,
        renderInput: (params) => <TextInput {...params} variant="standard" />,
      }}
    />
  );
};

export default MUICustomDateFilter;
