import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	}
});

export default function TemporaryDrawer() {
	const history = useHistory();
	const classes = useStyles();
	const [ open, setopen ] = React.useState(false);
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
					className={classes.list}
					role="presentation"
					onClick={() => setopen(false)}
					onKeyDown={() => setopen(false)}
				>
					<ListItem className="dashmenu__item">
						<ListItemIcon>
							<i className="material-icons">equalizer</i>
						</ListItemIcon>
						<ListItemText>Dashboard</ListItemText>
					</ListItem>
					<hr />
					<ListItem className="dashmenu__item" onClick={() => history.push('/manageAds')}>
						<ListItemIcon>
							<i className="material-icons">keyboard_arrow_right</i>
						</ListItemIcon>
						<ListItemText>Manage Ad Campaigns</ListItemText>
					</ListItem>
					<hr />
					<ListItem className="dashmenu__item" onClick={() => history.push('/manageBundles')}>
						<ListItemIcon>
							<i className="material-icons">keyboard_arrow_right</i>
						</ListItemIcon>
						<ListItemText>Manage Ad Bundles</ListItemText>
					</ListItem>
					<hr />
					<ListItem className="dashmenu__item">
						<ListItemIcon>
							<i className="material-icons">keyboard_arrow_right</i>
						</ListItemIcon>
						<ListItemText>Manage Audio Creations</ListItemText>
					</ListItem>
					<hr />
					<ListItem className="dashmenu__item">
						<ListItemIcon>
							<i className="material-icons">keyboard_arrow_right</i>
						</ListItemIcon>
						<ListItemText>Manage Banner Creatives</ListItemText>
					</ListItem>
					{state &&
					state.usertype === 'admin' && (
						<React.Fragment>
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/manageusers')}>
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
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/biddata')}>
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
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/phonedata')}>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText>Phone Data</ListItemText>
							</ListItem>
						</React.Fragment>
					)}
					{state &&
					state.usertype === 'admin' && (
						<React.Fragment>
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/zipdata')}>
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
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/categorydata')}>
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
							<hr />
							<ListItem className="dashmenu__item" onClick={() => history.push('/clientSideCamp')}>
								<ListItemIcon>
									<i className="material-icons">keyboard_arrow_right</i>
								</ListItemIcon>
								<ListItemText>Manage Client Reports</ListItemText>
							</ListItem>
						</React.Fragment>
					)}
				</div>
			</Drawer>
		</div>
	);
}
