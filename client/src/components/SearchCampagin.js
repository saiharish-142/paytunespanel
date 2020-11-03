import { Paper } from '@material-ui/core'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search';

function SearchCampagin({inval , setInval}) {
    return (
        <div>
            <Paper style={{width:'100%',margin:'0 0 20px 0'}}>
                <div style={{display:'flex',alignItems:'center',padding:'0px 20px 5px 20px'}}>
                    <SearchIcon color="primary" fontSize="large" />
                    <input type='text' placeholder='Search Ads by Ad Names' value={inval} onChange={e => setInval(e.target.value)} />
                </div>
            </Paper>
        </div>
    )
}

export default SearchCampagin
