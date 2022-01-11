import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

export default function BasicDateRangePicker({ setstartDate, setendDate }) {
	const [ value, setValue ] = React.useState([ null, null ]);
	// const [ startDate, setstartDate ] = React.useState('');
	// const [ endDate, setendDate ] = React.useState('');

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DateRangePicker
				startText="Check-in"
				endText="Check-out"
				value={value}
				onChange={(newValue) => {
					function formatDate(date) {
						var d = new Date(date),
							month = '' + (d.getMonth() + 1),
							day = '' + d.getDate(),
							year = d.getFullYear();

						if (month.length < 2) month = '0' + month;
						if (day.length < 2) day = '0' + day;

						return [ year, month, day ].join('-');
					}
					var did = [];
					// console.log(formatDate('Sun May 11,2014'));
					newValue &&
						newValue.map((x) => {
							console.log(formatDate(x));
							did.push(formatDate(x));
							// return formatDate(x);
						});
					console.log(newValue);
					console.log(did);
					setstartDate(newValue[0] ? did[0] : '');
					setendDate(newValue[1] ? did[1] : '');
					setValue(newValue);
				}}
				renderInput={(startProps, endProps) => (
					<React.Fragment>
						<TextField {...startProps} />
						<Box sx={{ mx: 2 }}> to </Box>
						{/* {console.log({ startDate, endDate })} */}
						<TextField {...endProps} />
					</React.Fragment>
				)}
			/>
		</LocalizationProvider>
	);
}
