/* Taken from http://jehiah.com/archive/scrolling-in-select-box-fires-onchange */

				function switchfunctions(el){
				   el._scrolling = el.onchange;
				   el.onchange = null;
				}

				var scrollfix = {
				'select' : function (el){

				   if ( typeof(document.media)=='string'){// dom check for ie
				     // grab the real functions
				     el.scrollonchange = el.onchange ? el.onchange : function(){return true;};
				     el.scrollonclick = el.onclick ? el.onclick : function(){return true;};
				     el.scrollonblur = el.onblur ? el.onblur : function(){return true;};
				     el.scrollonfocus = el.onfocus ? el.onfocus : function(){return true;};

				     // make a new onchange which will switch if it's fired twice in a row before onclick or onblur
				     el.onchange = function(){
				        debug("new onchange");
        				if (this.scrolling && this.scrollingfix){switchfunctions(this);return false;}
				        if (this.scrollingfix){this.scrolling=true;}
				        el.scrollonchange();
				     }

				     // now set the flag so we know this happened between onchange()'s
				     el.onfocus = function(){
        				this.scrolling = false; // set flag
				        this.scrollingfix = true;
        				this.scrollonfocus();
				     }

				     // now set the flag so we know this happened between onchange()'s
				     el.onclick = function(){
				        this.scrolling = false; // set flag
        				this.scrollingfix = true;
				        this.scrollonclick();
     				}

				     // set flag so we know this happened between scrolling && re-set the onchange if needed
				     el.onblur = function(){
        				if (this._scrolling){
				           this.scrolling = false; // set flag so original onchange is happy
        				   this.onchange = this._scrolling; // unswitch functions
				           this.onchange();
				           this._scrolling = false;
        				}
				        this.scrolling = false; // set flag
        				this.scrollingfix = false;
				        this.scrollonblur(); // run original function
				     }
				   }
				}
				};
				Behaviour.register(scrollfix);