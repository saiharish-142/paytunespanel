import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	nested: {
		paddingLeft: theme.spacing(4),
		cursor: 'pointer'
	}
}));

export default function TemporaryDrawer() {
	const history = useHistory();
	const classes = useStyles();
	const [ open, setopen ] = React.useState(false);
	const [ openManage, setopenManage ] = React.useState(false);
	const [ openConsole, setopenConsole ] = React.useState(false);
	const state = useSelector((state) => state.auth.user);
	return (
		<div>
			<div onClick={() => setopen(true)}>
				<i className="material-icons" style={{ fontSize: '30px', cursor: 'pointer', color: 'white' }}>
					menu
				</i>
			</div>
			<Drawer anchor="left" open={open} onClose={() => setopen(false)}>
				<div
					style={{ minWidth: '250px' }}
					className={classes.list}
					role="presentation"
					onKeyDown={() => setopen(false)}
				>
					<ListItem className="dashmenu__item" onClick={() => setopen(false)}>
						<ListItemIcon>
							<i className="material-icons">equalizer</i>
						</ListItemIcon>
						<ListItemText>Dashboard</ListItemText>
					</ListItem>
					<ListItem className="dashmenu__item" onClick={() => setopenManage(!openManage)}>
						<ListItemIcon>
							<i className="material-icons">keyboard_arrow_right</i>
						</ListItemIcon>
						<ListItemText>Manage</ListItemText>
						{openManage ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={openManage} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								className={classes.nested}
								onClick={() => {
									setopen(false);
									history.push('/manageAds?red=home');
								}}
							>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText> Campaigns</ListItemText>
							</ListItem>
							{state &&
							state.usertype === 'admin' && (
								<ListItem
									className={classes.nested}
									onClick={() => {
										setopen(false);
										history.push('/manageBundles');
									}}
								>
									<ListItemIcon>
										<i className="material-icons">keyboard_arrow_right</i>
									</ListItemIcon>
									<ListItemText>Bundles</ListItemText>
								</ListItem>
							)}
							{state &&
							state.usertype === 'admin' && (
								<ListItem
									className={classes.nested}
									onClick={() => {
										setopen(false);
										history.push('/bundleManage/pubbundle');
									}}
								>
									<ListItemIcon>
										<i className="material-icons">keyboard_arrow_right</i>
									</ListItemIcon>
									<ListItemText>Pub Bundles</ListItemText>
								</ListItem>
							)}
							{state &&
							state.usertype === 'admin' && (
								<ListItem
									className={classes.nested}
									onClick={() => {
										setopen(false);
										history.push('/bundleManage/createpubbundle');
									}}
								>
									<ListItemIcon>
										<i className="material-icons">keyboard_arrow_right</i>
									</ListItemIcon>
									<ListItemText>Create Pub Bundle</ListItemText>
								</ListItem>
							)}
							<ListItem className={classes.nested} onClick={() => setopen(false)}>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText>Audio Creations</ListItemText>
							</ListItem>
							<ListItem className={classes.nested} onClick={() => setopen(false)}>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText>Banner Creations</ListItemText>
							</ListItem>
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/manageusers');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Manage Users</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/clientSideCamp?red=home');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Client Reports</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
						</List>
					</Collapse>
					{state &&
					state.usertype === 'admin' && (
						<React.Fragment>
							<ListItem className="dashmenu__item" onClick={() => setopenConsole(!openConsole)}>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText>Consolidated Reports</ListItemText>
								{openConsole ? <ExpandLess /> : <ExpandMore />}
							</ListItem>
						</React.Fragment>
					)}
					<Collapse in={openConsole} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/publisherdata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Publisher wise Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/biddata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Bid Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/phonedata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Device Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/zipdata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Pincode Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/categorydata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Category Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/episodetabdata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Episode Tab Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/serverreport');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>Server Report</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
							{state &&
							state.usertype === 'admin' && (
								<React.Fragment>
									<ListItem
										className={classes.nested}
										onClick={() => {
											setopen(false);
											history.push('/useragentdata');
										}}
									>
										<ListItemIcon>
											<i className="material-icons">keyboard_arrow_right</i>
										</ListItemIcon>
										<ListItemText>User Agent Data</ListItemText>
									</ListItem>
								</React.Fragment>
							)}
						</List>
					</Collapse>
				</div>
			</Drawer>
		</div>
	);
}
