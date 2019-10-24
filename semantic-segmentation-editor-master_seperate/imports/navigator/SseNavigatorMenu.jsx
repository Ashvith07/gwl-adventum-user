import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MuiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Menu } from 'mdi-material-ui';
import Button from '@material-ui/core/Button';

import axios from 'axios';
class SseNavigatorMenu extends React.Component {
    constructor(props) {
        super(props);
        this.labels = ["All images", "Annotated images"];
    }
    state = {
        anchorEl: null,
        selectedFile: null,
        selectedFiles: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };


    handleClose = event => {
        switch (event.target.textContent) {
            case this.labels[0]: this.props.history.push("/"); break;
            case this.labels[1]: this.props.history.push("/annotated"); break;
        }
        this.setState({ anchorEl: null });
    };


    fileChangedHandler = event => {
        console.log("event",event.target.files)
        let files=event.target.files;
        this.setState({ selectedFile: event.target.files })
    }
    

    // uploadHandler = () => {
    //     console.log("state==",this.state)
    //     console.log("state file",this.state.selectedFile);
    //     let selected_file=this.state.selectedFile;
    //     console.log("selected_file",selected_file); 
    //     var formdata = new FormData();
    //     console.log("before appending",formdata)
    //     formdata.append('myFile',selected_file)

    //       console.log("after appending ",formdata);
    //   }

	singleFileChangedHandler = ( event ) => {
		this.setState({
			selectedFile: event.target.files[0]
		});
	};

    singleFileUploadHandler = ( event ) => {
		const data = new FormData();
// If file selected
console.log("selected",this.state.selectedFile);
		if ( this.state.selectedFile ) {
			data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
			console.log("data==",data)

			axios.post( '/api/profile/profile-img-upload', data, {

			
			})
				.then( ( response ) => {
					console.log("response",response);
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								this.ocShowAlert( 'Max size: 2MB', 'red' );
							} else {
								console.log( response.data );
// If not the given file type
								this.ocShowAlert( response.data.error, 'red' );
							}
						} else {
							// Success
							let fileName = response.data;
							console.log( 'filedata', fileName );
							// this.ocShowAlert( 'File Uploaded', '#3089cf' );
						}
					}
				}).catch( ( error ) => {
				// If another error
				// this.ocShowAlert( error, 'red' );
			});
		} else {
			// if file not selected throw error
			// this.ocShowAlert( 'Please upload file', 'red' );
		}
	};


    //   multipleFileChangedHandler = (event) => {
	// 	this.setState({
	// 		selectedFiles: event.target.files
	// 	});
	// 	console.log(event.target.files);
    // };
    
    // multipleFileUploadHandler = () => {
	// 	const data = new FormData();
    //     let selectedFiles = this.state.selectedFiles;
    //     console.log("selected file",selectedFiles);
    //       // If file selected
	// 	if ( selectedFiles ) {
	// 		for ( let i = 0; i < selectedFiles.length; i++ ) {
	// 			data.append( 'galleryImage', selectedFiles[ i ], selectedFiles[ i ].name );
	// 		}
	// 		axios.post( '/api/profile/multiple-file-upload', data, {
	// 			// headers: {
	// 			// 	'accept': 'application/json',
	// 			// 	'Accept-Language': 'en-US,en;q=0.8',
	// 			// 	'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
	// 			// }
	// 		})
	// 			.then( ( response ) => {
	// 				console.log( 'res', response.status );
	// 				if ( 200 === response.status ) {
	// 					// If file size is larger than expected.
	// 					if( response.data.error ) {
	// 						if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
	// 							// this.ocShowAlert( 'Max size: 2MB', 'red' );
	// 						} else if ( 'LIMIT_UNEXPECTED_FILE' === response.data.error.code ){
	// 							// this.ocShowAlert( 'Max 4 images allowed', 'red' );
	// 						} else {
	// 							// If not the given ile type
	// 							// this.ocShowAlert( response.data.error, 'red' );
	// 						}
	// 					} else {
	// 						// Success
	// 						let fileName = response.data;
	// 						console.log( 'fileName', fileName );
	// 						// this.ocShowAlert( 'File Uploaded', '#3089cf' );
	// 					}
	// 				}
	// 			}).catch( ( error ) => {
	// 			// If another error
	// 			// this.ocShowAlert( error, 'red' );
	// 		});
	// 	} else {
	// 		// if file not selected throw error
	// 		// this.ocShowAlert( 'Please upload file', 'red' );
	// 	}
	// };
    

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
               
                {/* <input
                    accept="image/*"
                    id="contained-button-file"
                  
                    type="file"
                    onChange={this.singleFileChangedHandler}
                />
              <button onClick={this.singleFileUploadHandler}>Upload!</button> */}

              <IconButton color="inherit" aria-label="Menu"
                    onClick={this.handleClick}>
                    <Menu />
                </IconButton>


                <MuiMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>{this.labels[0]}</MenuItem>
                    <MenuItem onClick={this.handleClose}>{this.labels[1]}</MenuItem>
                </MuiMenu>
            </div>
        );
    }
}

export default SseNavigatorMenu;