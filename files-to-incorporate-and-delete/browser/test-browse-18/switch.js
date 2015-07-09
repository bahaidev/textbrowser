function checkAll() {
					for (var j = 0; j <= 11; j++) {
						box = eval("window.document.forms['browse'].option" + j);
						if (box) {
							if (box.checked === false) box.checked = true;
						}
						for (var k = 0; k <= 8; k++) {
							if (eval("window.document.forms['browse'].option" + j + "_" + k)) {
								box = eval("window.document.forms['browse'].option" + j + "_" + k);
								if (box) {
									if (box.checked === false) box.checked = true;
								}
							}
					 	} // end for
					} // end for
				} // end function checkAll

				function uncheckAll() {
					for (var j = 0; j <= 11; j++) {
						box = eval("window.document.forms['browse'].option" + j);
						if (box) {
							if (box.checked === true) box.checked = false;
						}
						for (var k = 0; k <= 8; k++) {
							if (eval("window.document.forms['browse'].option" + j + "_" + k)) {
								box = eval("window.document.forms['browse'].option" + j + "_" + k); 
								if (box) {
									if (box.checked === true) box.checked = false;
								} // end if
							} // end if
					 	} // end for
					} // end for
				} // end function uncheckAll

				function switchAll() {
					for (var j = 0; j <= 11; j++) {
						if (eval("window.document.forms['browse'].option" + j)) {
							box = eval("window.document.forms['browse'].option" + j); 
							if (box) {
								box.checked = !box.checked;
							} // end if
						} // end if

						for (var k = 0; k <= 8; k++) {
							if (eval("window.document.forms['browse'].option" + j + "_" + k)) {
								box = eval("window.document.forms['browse'].option" + j + "_" + k);
								if (box) {
									box.checked = !box.checked;
								} // end if
							} // end if
					 	} // end for

				 	} // end for

				} // end function switchAll
				

				function getStyleObject(objectId) {
				    // cross-browser function to get an object's style object given its id
				    if(document.getElementById && document.getElementById(objectId)) {
					// W3C DOM
					return document.getElementById(objectId).style;
				    } else if (document.all && document.all(objectId)) {
					// MSIE 4 DOM
					return document.all(objectId).style;
				    } else if (document.layers && document.layers[objectId]) {
					// NN 4 DOM.. note: this won't find nested layers
					return document.layers[objectId];
				    } else {
					return false;
				    }
				} // getStyleObject

				function getObject(objectId) {
				    // cross-browser function to get an object's style object given its id
				    if(document.getElementById && document.getElementById(objectId)) {
					// W3C DOM
					return document.getElementById(objectId).value;
				    } else if (document.all && document.all(objectId)) {
					// MSIE 4 DOM
				return document.all(objectId).value;
				    } else if (document.layers && document.layers[objectId]) {
					// NN 4 DOM.. note: this won't find nested layers
					return document.layers[objectId];
				    } else {
					return false;
				    }
				} // getObject



				function hideshowObject(objectId, newDisplay) {
				    // get a reference to the cross-browser style object and make sure the object exists
				    var styleObject = getStyleObject(objectId);
				    if(styleObject) {
								styleObject.display = newDisplay;
								return true;
							}
				    else {
					// we couldn't find the object, so we can't change its visibility
					return false;
				    }
				} // hideshowObject






				// "newDisplay" can be "none" or "inline"
				// "objectId" is object to show or hide
				function changeObjectVisibility(origId, objectId, newDisplay) {

						var hidebutton = document.getElementById(origId);
		
				    // get a reference to the cross-browser style object and make sure the object exists
				    var styleObject = getStyleObject(objectId);
				    if(styleObject) {
								if (styleObject.display != 'none') {
									newDisplay = 'none';
									hidebutton.value = 'Show';
								}
								else {
									newDisplay = 'inline';
									hidebutton.value = 'Hide';
								}
								styleObject.display = newDisplay;
								return true;
							}
				    else {
					// we couldn't find the object, so we can't change its visibility
					return false;
				    }
				} // changeObjectVisibility

				function moveObject(objectId, newXCoordinate, newYCoordinate) {
				    // get a reference to the cross-browser style object and make sure the object exists
				    var styleObject = getStyleObject(objectId);
				    if(styleObject) {
					styleObject.left = newXCoordinate;
					styleObject.top = newYCoordinate;
					return true;
				    } else {
				// we couldn't find the object, so we can't very well move it
					return false;
				    }
				} // moveObject