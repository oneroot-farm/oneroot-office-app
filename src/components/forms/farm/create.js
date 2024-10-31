"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { makeStyles } from "tss-react/mui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";

// Firebase
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

// Components
import Loader from "@/components/loader";
import DatePicker from "@/components/datePicker";
import FormHeader from "@/components/forms/components/formHeader";
import FormFooter from "@/components/forms/components/formFooter";

// Inputs
import TextInput from "@/components/inputs/textInput";
import SelectInput from "@/components/inputs/selectInput";

// Constants
import {
  LANGUAGES,
  PAYMENT_TERMS,
  COCONUT_VARIETIES,
  TURMERIC_VARIETIES,
  TALUKS,
} from "@/constants";

// Define Zod schema
const farmSchema = z.object({
  farmerName: z.string().min(1, "Farmer name is required"),
  mobileNumber: z.string().min(10).max(10, "Mobile number must be 10 digits"),
  village: z.string().min(1, "Village is required"),
  taluk: z.string().min(1, "Taluk is required"),
  district: z.string().min(1, "District is required"),
  language: z.string().nullable().refine((val) => val !== "", "Language is required"),
  paymentTerms: z.string().nullable().refine((val) => val !== "", "Payment terms are required"),
  farmId: z.string().min(1, "Farm ID is required"),
  tenderCoconutAgeOfTree: z.number().nonnegative(),
  tenderCoconutGeneralHarvestCycleInDays: z.number().nonnegative(),
  tenderCoconutNumberOfTrees: z.number().nonnegative(),
  tenderCoconutNumberOfNuts: z.number().nonnegative(),
  tenderCoconutIsOrganic: z.boolean(),
  tenderCoconutHeightOfTree: z.number().nonnegative(),
  tenderCoconutChutePercentage: z.number().nonnegative(),
  tenderCoconutVariety: z.string().optional(),
  tenderCoconutReadyToHarvestDate: z.string().optional(),
  tenderCoconutNutsFromLastHarvest: z.number().nonnegative(),
  turmericRegion: z.string().optional(),
  turmericVariety: z.string().optional(),
  turmericIsOrganic: z.boolean().optional(),
  turmericGeneralHarvestCycleInDays: z.number().nonnegative(),
  turmericIsPolished: z.boolean().optional(),
  turmericReadyToHarvestDate: z.string().optional(),
  turmericTotalQuantity: z.number().nonnegative(),
  coords: z.string().optional(),
  mapLink: z.string().optional(),
  notes: z.string().optional(),
});

const defaultValues = {
  farmerName: "",
  mobileNumber: "",
  village: "",
  taluk: "",
  district: "",
  language: "",
  paymentTerms: "",
  farmId: "",
  tenderCoconutAgeOfTree: 0,
  tenderCoconutGeneralHarvestCycleInDays: 0,
  tenderCoconutNumberOfTrees: 0,
  tenderCoconutNumberOfNuts: 0,
  tenderCoconutIsOrganic: false,
  tenderCoconutHeightOfTree: 0,
  tenderCoconutChutePercentage: 0,
  tenderCoconutVariety: "",
  tenderCoconutReadyToHarvestDate: dayjs().format("YYYY-MM-DD"),
  tenderCoconutNutsFromLastHarvest: 0,
  turmericRegion: "",
  turmericVariety: "",
  turmericIsOrganic: false,
  turmericGeneralHarvestCycleInDays: 0,
  turmericIsPolished: false,
  turmericReadyToHarvestDate: dayjs().format("YYYY-MM-DD"),
  turmericTotalQuantity: 0,
  coords: "",
  mapLink: "",
  notes: "",
};



const CreateFarmForm = ({ handleModalClose, refetch }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues,
    resolver: zodResolver(farmSchema),
  });

  const [loading, setLoading] = useState(false);
  const { cx, classes } = useStyles();

  const [dates, setDates] = useState({
    // Initialize dates as dayjs objects if needed
    tenderCoconutReadyToHarvestDate: dayjs(),
    turmericReadyToHarvestDate: dayjs(),
    dryCoconutReadyToHarvestDate: dayjs(),
    bananaReadyToHarvestDate: dayjs(),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("form data",data);
      // const payload = {
      //   ...data,
      //   tenderCoconutReadyToHarvestDate: dayjs(data.tenderCoconutReadyToHarvestDate).format("YYYY-MM-DD"),
      //   turmericReadyToHarvestDate: dayjs(data.turmericReadyToHarvestDate).format("YYYY-MM-DD"),
      // };
      // await addDoc(collection(db, "farms"), payload);
      // toast.success("Farm created successfully.");
      // reset(defaultValues);
      // handleModalClose();
      // if (refetch) refetch();
    } catch (error) {
      console.error("Error creating farm:", error);
      toast.error("Failed to create farm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader sx={{ mt: 4 }}>Farmer Details</FormHeader>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="farmerName"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Farmer Name*"
        variant="outlined"
        error={!!errors.farmerName}
        helperText={errors.farmerName?.message}
      />
    )}
  />

  <Controller
    name="mobileNumber"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Mobile Number*"
        variant="outlined"
        error={!!errors.mobileNumber}
        helperText={errors.mobileNumber?.message}
      />
    )}
  />
</Box>


<Box className={cx(classes.inputWrapper)}>
<Controller
    name="taluk"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Taluk*"
        variant="outlined"
        error={!!errors.taluk}
        message={errors.taluk?.message}
      >
        {TALUKS.map((l) => (
          <MenuItem key={l.value} value={l.value}>
            {l.label}
          </MenuItem>
        ))}
      </SelectInput>
    )}
  />
<Controller
name="district"
control={control}
render={({ field }) => (
<TextInput
{...field}
fullWidth
label="District*"
variant="outlined"
error={!!errors.district}
helperText={errors.district?.message}
/>
)}
/>
</Box>


<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="language"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Language*"
        variant="outlined"
        error={!!errors.language}
        message={errors.language?.message}
      >
        {LANGUAGES.map((l) => (
          <MenuItem key={l.value} value={l.value}>
            {l.label}
          </MenuItem>
        ))}
      </SelectInput>
    )}
  />

  <Controller
    name="paymentTerms"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Payment Terms*"
        variant="outlined"
        error={!!errors.paymentTerms}
        message={errors.paymentTerms?.message}
      >
        {PAYMENT_TERMS.map((term) => (
          <MenuItem key={term.value} value={term.value}>
            {term.label}
          </MenuItem>
        ))}
      </SelectInput>
    )}
  />
</Box>

  
<Box className={cx(classes.inputWrapper)}>
       
       <Controller
         name="village"
         control={control}
         render={({ field }) => (
           <TextInput
             {...field}
             fullWidth
             label="Village*"
             variant="outlined"
             error={!!errors.village}
             helperText={errors.village?.message}
           />
         )}
       />
     </Box>
     




{/* Farm Details */}
<FormHeader sx={{ mt: 4 }}>Farm Details</FormHeader>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="farmId"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Farm ID*"
        variant="outlined"
        error={!!errors.farmId}
        helperText={errors.farmId?.message}
      />
    )}
  />

  <Controller
    name="farmIdentifier"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Farm Identifier*"
        variant="outlined"
        error={!!errors.farmIdentifier}
        helperText={errors.farmIdentifier?.message}
      />
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="weather"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Weather"
        variant="outlined"
        error={!!errors.weather}
        helperText={errors.weather?.message}
      />
    )}
  />

  <Controller
    name="lastWeatherUpdated"
    control={control}
    render={({ field }) => (
      <TextInput
        {...field}
        fullWidth
        label="Last Weather Updated"
        variant="outlined"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.lastWeatherUpdated}
        helperText={errors.lastWeatherUpdated?.message}
      />
    )}
  />
</Box>

{/* Crop Details */}
<FormHeader sx={{ mt: 4 }}>Tender Coconut Details</FormHeader>

{/* Tender Coconut Details */}
<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="tenderCoconutVariety"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Tender Coconut Variety*"
        variant="outlined"
        error={!!errors.tenderCoconutVariety}
        message={errors.tenderCoconutVariety?.message}
      >
        {COCONUT_VARIETIES.map((variety) => (
          <MenuItem key={variety.value} value={variety.value}>
            {variety.label}
          </MenuItem>
        ))}
      </SelectInput>
    )}
  />

  <Controller
    name="tenderCoconutNumberOfTrees"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Number Of Trees*"
        variant="outlined"
        error={!!errors.tenderCoconutNumberOfTrees}
        helperText={errors.tenderCoconutNumberOfTrees?.message}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="tenderCoconutHeightOfTree"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Height Of Tree*"
        variant="outlined"
        inputProps={{
          step: 0.1,
        }}
        error={!!errors.tenderCoconutHeightOfTree}
        helperText={errors.tenderCoconutHeightOfTree?.message}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    )}
  />

  <Controller
    name="tenderCoconutAgeOfTree"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Age Of Tree*"
        variant="outlined"
        inputProps={{
          step: 0.1,
        }}
        error={!!errors.tenderCoconutAgeOfTree}
        helperText={errors.tenderCoconutAgeOfTree?.message}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="tenderCoconutGeneralHarvestCycleInDays"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="General Harvest Cycle In Days*"
        variant="outlined"
        error={!!errors.tenderCoconutGeneralHarvestCycleInDays}
        helperText={errors.tenderCoconutGeneralHarvestCycleInDays?.message}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    )}
  />

  <Controller
    name="tenderCoconutIsOrganic"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Is Organic*"
        variant="outlined"
        error={!!errors.tenderCoconutIsOrganic}
        message={errors.tenderCoconutIsOrganic?.message}
      >
        <MenuItem value={true}>Yes</MenuItem>
        <MenuItem value={false}>No</MenuItem>
      </SelectInput>
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="tenderCoconutChutePercentage"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Chute Percentage*"
        variant="outlined"
        inputProps={{
          step: 0.1,
        }}
        error={!!errors.tenderCoconutChutePercentage}
        helperText={errors.tenderCoconutChutePercentage?.message}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    )}
  />

  <Controller
    name="tenderCoconutNumberOfNuts"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Number Of Nuts*"
        variant="outlined"
        error={!!errors.tenderCoconutNumberOfNuts}
        helperText={errors.tenderCoconutNumberOfNuts?.message}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <DatePicker
    pickerProps={{
      format: "DD-MM-YYYY",
      label: "Ready To Harvest Date*",
      sx: { width: "100%" },
      value: dates.tenderCoconutReadyToHarvestDate,
      onChange: (date) =>
        setDates((prev) => ({
          ...prev,
          tenderCoconutReadyToHarvestDate: dayjs(date),
        })),
      renderInput: (params) => <TextInput {...params} />,
    }}
  />

  <Controller
    name="tenderCoconutNutsFromLastHarvest"
    control={control}
    render={({ field: { onChange, ...rest } }) => (
      <TextInput
        {...rest}
        fullWidth
        type="number"
        label="Nuts From Last Harvest*"
        variant="outlined"
        error={!!errors.tenderCoconutNutsFromLastHarvest}
        helperText={errors.tenderCoconutNutsFromLastHarvest?.message}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    )}
  />
</Box>

<Box className={cx(classes.inputWrapper)}>
  <Controller
    name="tenderCoconutIsReadyToHarvest"
    control={control}
    render={({ field }) => (
      <SelectInput
        {...field}
        fullWidth
        label="Is Ready To Harvest*"
        variant="outlined"
        error={!!errors.tenderCoconutIsReadyToHarvest}
        message={errors.tenderCoconutIsReadyToHarvest?.message}
      >
        <MenuItem value={true}>Yes</MenuItem>
        <MenuItem value={false}>No</MenuItem>
      </SelectInput>
    )}
  />

</Box>
<Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
<Controller
name="tenderCoconutLocation.latitude"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
  {...rest}
  fullWidth
  type="number"
  label="Latitude*"
  variant="outlined"
  error={!!errors.tenderCoconutLocation?.latitude}
  helperText={errors.tenderCoconutLocation?.latitude?.message}
  onChange={(e) => onChange(parseFloat(e.target.value))}
/>
)}
/>

<Controller
name="tenderCoconutLocation.longitude"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
  {...rest}
  fullWidth
  type="number"
  label="Longitude*"
  variant="outlined"
  error={!!errors.tenderCoconutaLocation?.longitude}
  helperText={errors.tenderCoconutLocation?.longitude?.message}
  onChange={(e) => onChange(parseFloat(e.target.value))}
/>
)}
/>
</Box>


{/* Turmeric Details */}
<FormHeader sx={{ mt: 4 }}>Turmeric Details</FormHeader>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericRegion"
control={control}
render={({ field }) => (
<TextInput
{...field}
fullWidth
label="Region*"
variant="outlined"
error={!!errors.turmericRegion}
helperText={errors.turmericRegion?.message}
/>
)}
/>

<Controller
name="turmericVariety"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Turmeric Variety*"
variant="outlined"
error={!!errors.turmericVariety}
message={errors.turmericVariety?.message}
>
{TURMERIC_VARIETIES.map((variety) => (
  <MenuItem key={variety.value} value={variety.value}>
    {variety.label}
  </MenuItem>
))}
</SelectInput>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericIsOrganic"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Organic*"
variant="outlined"
error={!!errors.turmericIsOrganic}
message={errors.turmericIsOrganic?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="turmericGeneralHarvestCycleInDays"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="General Harvest Cycle In Days*"
variant="outlined"
error={!!errors.turmericGeneralHarvestCycleInDays}
helperText={errors.turmericGeneralHarvestCycleInDays?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericIsPolished"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Polished*"
variant="outlined"
error={!!errors.turmericIsPolished}
message={errors.turmericIsPolished?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="turmericIsUnpolished"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Unpolished*"
variant="outlined"
error={!!errors.turmericIsUnpolished}
message={errors.turmericIsUnpolished?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericIsSinglePolished"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Single Polished*"
variant="outlined"
error={!!errors.turmericIsSinglePolished}
message={errors.turmericIsSinglePolished?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="turmericIsDoublePolished"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Double Polished*"
variant="outlined"
error={!!errors.turmericIsDoublePolished}
message={errors.turmericIsDoublePolished?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<DatePicker
pickerProps={{
format: "DD-MM-YYYY",
label: "Ready To Harvest Date*",
sx: { width: "100%" },
value: dates.turmericReadyToHarvestDate,
onChange: (date) =>
setDates((prev) => ({
  ...prev,
  turmericReadyToHarvestDate: dayjs(date),
})),
renderInput: (params) => <TextInput {...params} />,
}}
/>

<Controller
name="turmericTotalQuantity"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Total Quantity*"
variant="outlined"
error={!!errors.turmericTotalQuantity}
helperText={errors.turmericTotalQuantity?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericFingerQuantity"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Finger Quantity*"
variant="outlined"
error={!!errors.turmericFingerQuantity}
helperText={errors.turmericFingerQuantity?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>

<Controller
name="turmericBulbQuantity"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Bulb Quantity*"
variant="outlined"
error={!!errors.turmericBulbQuantity}
helperText={errors.turmericBulbQuantity?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="turmericIsIPM"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is IPM*"
variant="outlined"
error={!!errors.turmericIsIPM}
message={errors.turmericIsIPM?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="turmericIsReadyToHarvest"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Ready To Harvest*"
variant="outlined"
error={!!errors.turmericIsReadyToHarvest}
message={errors.turmericIsReadyToHarvest?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>



{/* Dry Coconut Details */}
<FormHeader sx={{ mt: 4 }}>Dry Coconut Details</FormHeader>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="dryCoconutIsHarvested"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Harvested*"
variant="outlined"
error={!!errors.dryCoconutIsHarvested}
message={errors.dryCoconutIsHarvested?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="dryCoconutIsOnTree"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is On Tree*"
variant="outlined"
error={!!errors.dryCoconutIsOnTree}
message={errors.dryCoconutIsOnTree?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="dryCoconutNumberOfNutsAvailable"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Number Of Nuts Available*"
variant="outlined"
error={!!errors.dryCoconutNumberOfNutsAvailable}
helperText={errors.dryCoconutNumberOfNutsAvailable?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>

<Controller
name="dryCoconutIsWithSemiHusk"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is With Semi Husk*"
variant="outlined"
error={!!errors.dryCoconutIsWithSemiHusk}
message={errors.dryCoconutIsWithSemiHusk?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="dryCoconutGeneralHarvestCycleInDays"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="General Harvest Cycle In Days*"
variant="outlined"
error={!!errors.dryCoconutGeneralHarvestCycleInDays}
helperText={errors.dryCoconutGeneralHarvestCycleInDays?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>

<DatePicker
pickerProps={{
format: "DD-MM-YYYY",
label: "Ready To Harvest Date*",
sx: { width: "100%" },
value: dates.dryCoconutReadyToHarvestDate,
onChange: (date) =>
setDates((prev) => ({
  ...prev,
  dryCoconutReadyToHarvestDate: dayjs(date),
})),
renderInput: (params) => <TextInput {...params} />,
}}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="dryCoconutIsWithHusk"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is With Husk*"
variant="outlined"
error={!!errors.dryCoconutIsWithHusk}
message={errors.dryCoconutIsWithHusk?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>

<Controller
name="dryCoconutIsReadyToHarvest"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Ready To Harvest*"
variant="outlined"
error={!!errors.dryCoconutIsReadyToHarvest}
message={errors.dryCoconutIsReadyToHarvest?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>



{/* Banana Details */}
<FormHeader sx={{ mt: 4 }}>Banana Details</FormHeader>

<Box className={cx(classes.inputWrapper)}>
{/* <Controller
name="bananaVariety"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Banana Variety*"
variant="outlined"
error={!!errors.bananaVariety}
message={errors.bananaVariety?.message}
>
{BANANA_VARIETIES.map((variety) => (
  <MenuItem key={variety.value} value={variety.value}>
    {variety.label}
  </MenuItem>
))}
</SelectInput>
)}
/> */}

<Controller
name="bananaTarShape"
control={control}
render={({ field }) => (
<TextInput
{...field}
fullWidth
label="Tar Shape*"
variant="outlined"
error={!!errors.bananaTarShape}
helperText={errors.bananaTarShape?.message}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="bananaTarWeight"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Tar Weight*"
variant="outlined"
error={!!errors.bananaTarWeight}
helperText={errors.bananaTarWeight?.message}
onChange={(e) => onChange(parseFloat(e.target.value))}
/>
)}
/>

<Controller
name="bananaNumberOfTrees"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Number Of Trees*"
variant="outlined"
error={!!errors.bananaNumberOfTrees}
helperText={errors.bananaNumberOfTrees?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="bananaNumberOfTreesRTH"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Number Of Trees Ready To Harvest*"
variant="outlined"
error={!!errors.bananaNumberOfTreesRTH}
helperText={errors.bananaNumberOfTreesRTH?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>

<Controller
name="bananaGeneralHarvestCycleInDays"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="General Harvest Cycle In Days*"
variant="outlined"
error={!!errors.bananaGeneralHarvestCycleInDays}
helperText={errors.bananaGeneralHarvestCycleInDays?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<DatePicker
pickerProps={{
format: "DD-MM-YYYY",
label: "Ready To Harvest Date*",
sx: { width: "100%" },
value: dates.bananaReadyToHarvestDate,
onChange: (date) =>
setDates((prev) => ({
  ...prev,
  bananaReadyToHarvestDate: dayjs(date),
})),
renderInput: (params) => <TextInput {...params} />,
}}
/>

<Controller
name="bananaCutCount"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
{...rest}
fullWidth
type="number"
label="Cut Count*"
variant="outlined"
error={!!errors.bananaCutCount}
helperText={errors.bananaCutCount?.message}
onChange={(e) => onChange(parseInt(e.target.value, 10))}
/>
)}
/>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="bananaCutType"
control={control}
render={({ field }) => (
<TextInput
{...field}
fullWidth
label="Cut Type*"
variant="outlined"
error={!!errors.bananaCutType}
helperText={errors.bananaCutType?.message}
/>
)}
/>

<Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
<Controller
name="bananaLocation.latitude"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
  {...rest}
  fullWidth
  type="number"
  label="Latitude*"
  variant="outlined"
  error={!!errors.bananaLocation?.latitude}
  helperText={errors.bananaLocation?.latitude?.message}
  onChange={(e) => onChange(parseFloat(e.target.value))}
/>
)}
/>

<Controller
name="bananaLocation.longitude"
control={control}
render={({ field: { onChange, ...rest } }) => (
<TextInput
  {...rest}
  fullWidth
  type="number"
  label="Longitude*"
  variant="outlined"
  error={!!errors.bananaLocation?.longitude}
  helperText={errors.bananaLocation?.longitude?.message}
  onChange={(e) => onChange(parseFloat(e.target.value))}
/>
)}
/>
</Box>
</Box>

<Box className={cx(classes.inputWrapper)}>
<Controller
name="bananaIsReadyToHarvest"
control={control}
render={({ field }) => (
<SelectInput
{...field}
fullWidth
label="Is Ready To Harvest*"
variant="outlined"
error={!!errors.bananaIsReadyToHarvest}
message={errors.bananaIsReadyToHarvest?.message}
>
<MenuItem value={true}>Yes</MenuItem>
<MenuItem value={false}>No</MenuItem>
</SelectInput>
)}
/>
</Box>

        <FormFooter>
          <Button size="large" variant="contained" type="submit" disabled={loading}>Submit</Button>
        </FormFooter>
        <Loader open={loading} />
      </form>
    </Container>
  );
};
const useStyles = makeStyles({
  name: { CreateFarmForm },
})((theme) => ({
  inputWrapper: {
    display: "flex",
    gap: "12px",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
    },
  },
}));

export default CreateFarmForm;
