
/********************************/
/*** CROSSBROWSER DRAGHANDLER ***/
/********************************/

_oElem = null;
function DragHandler(oElem) {
	_dragBegin = function(e) {
		var oElem = _oElem = this;
		if (isNaN(parseInt(oElem.style.left))) { oElem.style.left = '0px'; }
		if (isNaN(parseInt(oElem.style.top))) { oElem.style.top = '0px'; }
		
		var x = parseInt(oElem.style.left);
		var y = parseInt(oElem.style.top);
		
		e = e ? e : window.event;
		oElem.mouseX = e.clientX;
		oElem.mouseY = e.clientY;
		oElem.dragBegin(oElem, x, y);
		document.onmousemove = _drag;
		document.onmouseup = _dragEnd;
				
		return false;
	}
	_drag = function(e) {
		var oElem = _oElem;
		var x = parseInt(oElem.style.left);
		var y = parseInt(oElem.style.top);

		e = e ? e : window.event;
		oElem.style.left = x + (e.clientX - oElem.mouseX) + 'px';
		oElem.style.top = y + (e.clientY - oElem.mouseY) + 'px';
		oElem.mouseX = e.clientX;
		oElem.mouseY = e.clientY;
		oElem.drag(oElem, x, y);
		
		return false;
	}
	_dragEnd = function() {
		var oElem = _oElem;
		var x = parseInt(oElem.style.left);
		var y = parseInt(oElem.style.top);

		oElem.dragEnd(oElem, x, y);
		document.onmousemove = null;
		document.onmouseup = null;
		_oElem = null;
	}
	
	oElem.onmousedown = _dragBegin;
	oElem.dragBegin = _dragBegin;
	oElem.drag = _drag;
	oElem.dragEnd = _dragEnd;
	return oElem;
};


/********************************/
/*** BW DRAGHANDLER FUNCTIONS ***/
/********************************/

function getWidthouter(container) {
	var width_outer = document.getElementById(container).offsetWidth;
	if (container.match(/thumbnails/)) width_outer += 1;
	return width_outer;
}

bw_dragged = 0;
function bw_drag(s) {
	
	this.s = s;
	this.container = s.container;
	this.type = s.type;
	this.count = 0;
	this.mousex = 0;
	this.debug = 0;
	this.startx = 0;
	this.scrollEffect;
	this.interval;
	this.diff = 0;
	this.page = 0;
	this.play = 0;
	
	this.speed = 800;
	if (s.speed > 0) this.speed = s.speed;
	
	this.timer = 3000;
	if (s.timer >= 0) this.timer = s.timer;
	
	this.updateInfo = function(x, y, elem, status) {
		var s = '#' + elem + ' (' + status + ')' + ' x:' + x + ', y:' + y + ' | dragged: ' + bw_dragged + "<br />scroll-x: " + document.getElementById(this.container).scrollLeft + "| diff: " + this.diff + "<br />mx: " + this.mousex + "<br />count: " + this.count;
		if (this.debug) document.getElementById('log').innerHTML = s;
	}
	this.calcDiff = function(x) {
		var wx = document.getElementsByTagName('html')[0].scrollLeft - this.posx;
		var x = wx + x;
		this.diff = this.mousex-x;
		this.mousex = x;
		if (this.count == 1) this.diff = 0;
	}	
	this.setPosition = function() {
		var sx = document.getElementById(this.container).scrollLeft;
		var calc = sx+this.diff;						
		if (calc < 0) calc = 0;
		document.getElementById(this.container).scrollLeft = calc;
	}
	this.calcColumn = function(p, x) {
		var width_inner = document.getElementById(p.container).getElementsByTagName('div')[0].offsetWidth;
		var columns = Math.ceil((width_inner/p.width_outer)-0.099); 
		var x = document.getElementById(p.container).scrollLeft;
		
		var calc;
		for (var i=0; i<columns; i++) {
			// left site
			if (x >= i*p.width_outer && x < i*p.width_outer+(p.width_outer/2)) {
				calc = i;	
				i = columns;
			} else 
			// right site
			if (x < (i+1)*p.width_outer && x > i*p.width_outer+(p.width_outer/2)) {
				calc = i+1;
				i = columns;
			}
		}
		
		if (p.startx-x < -5 && p.startx-x > -1*p.width_outer/2) calc=calc+1;
		if (p.startx-x > 5 && p.startx-x < p.width_outer/2) calc=calc-1;
		if (calc >= columns) calc = columns-1;
		if (calc < 0) calc = 0;
		
		return calc;
	}
	this.begin = function(element, x, y) {
		var p = window[this.id];
		bw_dragged = 0;
		p.startx = document.getElementById(p.container).scrollLeft;
		if (typeof(p.scrollEffect) == 'object') p.scrollEffect.stop(true, false);
		p.calcDiff(x);
		p.updateInfo(x, y, element.id, 'begin drag');
	}
	this.drag = function(element, x, y) {	
		var p = window[this.id];
		p.count++;
		if (p.count > 1) { 
			bw_dragged = 1;
			p.calcDiff(x);
			p.setPosition();
			if (p.slideshow) p.pause();
			p.updateInfo(x, y, element.id, 'dragging');
		}
		
		p.showImage(p.calcColumn(p, x));
	}
	this.end = function(element, x, y) {
		var p = window[this.id];
		p.calcDiff(x);
		p.count = 0;		
		
		var column = p.calcColumn(p, x);
		p.gotoX(column, 1000);
		p.updateInfo(x, y, element.id, 'end drag');
	}
	this.next = function(speed) {
		if (document.getElementById('ob_container')) return false;
		var album = this.s.album;
		if (this.page < album.photocount-1) this.page++;
		else if (this.slideshow) this.page = 0;
		this.gotoX(this.page, speed);
	}
	this.prev = function(speed) {
		if (this.page > 0) this.page--;
		this.gotoX(this.page, speed);
	}
	this.play = function(init) {
		this.slideshow = 1;
		if (!init) this.next();
		if (init) clearInterval(this.interval);		
		
		var tmp = 0;
		if (this.timer == 0) {
			tmp = this.speed;
			this.next();
		} 
		this.interval = setInterval("window['" + this.container + "'].next()", (1*this.timer+tmp));
		$('#' + this.container + '_bw_nav .bw_nav_toggle').css('backgroundPosition', '60px 30px');
	}
	this.pause = function() {
		this.slideshow = 0;
		clearInterval(this.interval);
		$('#' + this.container + '_bw_nav .bw_nav_toggle').css('backgroundPosition', '60px 0px');
	}	
	this.gotoX = function(page, speed) {
		if (!speed > 0) speed = this.speed; 
		var value = page * this.width_outer;		
		
		if (typeof(this.scrollEffect) == 'object') this.scrollEffect.stop(true, false);
		this.scrollEffect = $('#' + this.container).scrollTo(value + 'px', speed);	// soft scroll
		
		if (this.type == 'thumbnails' && document.getElementById(this.container + '_bw_dots')) {
			$('#' + this.container + '_bw_dots li').attr('class', '');
			$('#' + this.container + '_bw_dots li').attr('classname', '');
			document.getElementById(this.container + '_bw_dot_' + page).setAttribute('class', 'bw_dot_current')
			document.getElementById(this.container + '_bw_dot_' + page).setAttribute('className', 'bw_dot_current')
		}	
		
		this.page = page;
		this.navigation();
		this.showImage();
	}
	this.showImage = function(page) {
		if (typeof(page) == "undefined") page = this.page;
		$('#' + this.container + ' .bw_' + this.type + '_column:eq(' + page + ') img').each(function() {
			if ($(this).attr('data-original') != '')	{
				$(this).attr('src', $(this).attr('data-original'));
				$(this).attr('data-original', '');
			}
		});
		page++;
		$('#' + this.container + ' .bw_' + this.type + '_column:eq(' + page + ') img').each(function() {
			if ($(this).attr('data-original') != '')	{
				$(this).attr('src', $(this).attr('data-original'));
				$(this).attr('data-original', '');
			}
		});
	}
	this.navigation = function() {
		if (this.type == 'slideshow' && document.getElementById(this.container + '_bw_nav')) {
			var album = this.s.album;
			
			$('#' + this.container + '_bw_nav' + ' .bw_nav_next').css({backgroundPosition:'30px 0', cursor:'pointer'});
			$('#' + this.container + '_bw_nav' + ' .bw_nav_prev').css({backgroundPosition:'0 0', cursor:'pointer'});
			
			if (this.page >= (album.photocount-1)) $('#' + this.container + '_bw_nav' + ' .bw_nav_next').css({backgroundPosition:'30px 30px', cursor:'default'});
			if (this.page == 0) $('#' + this.container + '_bw_nav' + ' .bw_nav_prev').css({backgroundPosition:'0 30px', cursor:'default'});
			if (album.photocount-1 == 0) {
				$('#' + this.container + '_bw_nav .bw_nav_toggle').css('display', 'none');
				this.pause();
			}
		}
	}
	
	this.posx = getX(s.container);
	this.dragable = new DragHandler(document.getElementById(s.container));
	this.dragable.dragBegin = this.begin;
	this.dragable.drag = this.drag;
	this.dragable.dragEnd = this.end;
	
	this.width_outer = getWidthouter(s.container);
	this.aid = s.aid;
	
	document.getElementById(s.container).scrollLeft = 0;
	if (s.start_pid > 0) {
		
		// load pid
		this.showImage(s.start_page);
		this.gotoX(s.start_page, 1);
		this.pause();
		
	} else {
	
		// default
		this.showImage(0);

		// slideshow: navigation
		if (s.type == 'slideshow' && document.getElementById(this.container + '_bw_nav')) {
			this.navigation();
			if (s.navigation == 'pause') this.pause();
			else {
				if (typeof(BWPE) == 'undefined') this.play(1);
			}
		}
	}
} // end of bw_drag

function getX(elem) {
	obj = document.getElementById(elem);
	var pos = [obj.offsetLeft,obj.offsetTop];
	while (obj.offsetParent!=null) {
		var objp = obj.offsetParent;
		pos[0] += objp.offsetLeft-objp.scrollLeft;
		pos[1] += objp.offsetTop-objp.scrollTop;
		obj = objp;
	}
	return pos[0];
}	

/**************************/
/*** BW ALBUM FUNCTIONS ***/
/**************************/

function bw_initAlbum(id, aid, type, width, option1, option2, option3) {
	
	// alert(id +','+ aid+','+ type+','+ width+','+ option1+','+ option2)
	
	// check id, aid
	if (!document.getElementById(id) || !aid.match(/\d+/)) return false;
	
	// check type
	if (type != 'thumbnails' && type != 'slideshow' && type != 'mosaic') type = 'thumbnails';
	
	// check width
	width = width.replace(/px/, "");
	if (!width.match(/^\d+$/)) width = 'auto';

	// check options
	if (type == 'thumbnails' || type == 'mosaic') {
		if (!option1.match(/(small|medium|large)/)) option1 = 'small';		// size
		if (!option2.match(/\d+/)) option = '';								// row
	} else {
		if (option1 != 'fast' && option1 != 'slow' && option1 != 'live') option1 = 'normal';		// speed
		if (option2 != 'no' && option2 != 'yes') option2 = 'yes';			// autostart
	}

	if (typeof(jQuery) == 'undefined') bw_insertFile("../appfiles/photoalbum/jquery-1.4.2.min.js");
	bw_checkInit(id, aid, type, width, option1, option2, option3);
}

function bw_initDiv(id, type, width) {

	if (document.getElementById(id).getAttribute('class') == 'bw_album_' + type) {
		//alert('initDiv ' + id + ' -> false')
		return false;
	}
		
	document.getElementById(id).style.width = "100%";
	document.getElementById(id).setAttribute('onclick', '');
	document.getElementById(id).innerHTML = '';
	
	if (typeof(width) == "undefined") width = '';
	if (!width > 0) width = width.replace(/px/, "");
	
	// get parent size
	var parent_width;
	if (document.getElementById(id).parentNode) {
		if (document.getElementById(id).parentNode.getAttribute('class') == 'bw_album') parent_width = document.getElementById(id).parentNode.offsetWidth;
		else parent_width = document.getElementById(id).parentNode.offsetWidth;
	} else parent_width = document.getElementById(id).offsetWidth;

	// fix thumbnails
	if (document.getElementById(id).getAttribute('class') == null) {
		
		if (type == 'thumbnails') {
			
			var inner = document.createElement('div');
			inner.setAttribute('id', '_' + id);
			document.getElementById(id).appendChild(inner);
			
			document.getElementById(id).style.position = 'relative';
			document.getElementById(id).style.left = '-4px';
			document.getElementById(id).setAttribute('id', '');
			document.getElementById('_' + id).setAttribute('id', id);
		}
		
		var d = document.getElementById(id);
		d.setAttribute('class', 'bw_album_' + type);
		d.setAttribute('className', 'bw_album_' + type);
	}

	// set width
	if (width == 'auto' || width == '') { 
		if (parent_width > 0 && parent_width <= 1200) width = parent_width; 
		else width = 500;
	}
	
	// div height
	if (width > 0) {
		document.getElementById(id).style.width = width + 'px';
		document.getElementById(id).style.height = '100px';
	}
	
	return width;
}

function bw_checkInit(id, aid, type, width, option1, option2, option3) {
	
	if (typeof(jQuery) != 'undefined') {
		
		bw_insertFile("../appfiles/photoalbum/jquery.scrollTo-1.4.2-min.js");
		bw_insertFile("../appfiles/photoalbum/orangebox/orangebox.js?3");
		bw_insertFile("../appfiles/photoalbum/orangebox/orangebox.css?3");
		bw_insertFile("../appfiles/photoalbum/photoalbum.css");
		
		$(document).ready(function() {
			width = bw_initDiv(id, type, width);
			bw_insertAlbum(id, aid, type, width, option1, option2, option3);
		});

	} else setTimeout("bw_checkInit('"+id+"','"+aid+"','"+type+"','"+width+"','"+option1+"','"+option2+"','"+option3+"')", 150);
}

function bw_insertAlbum(id, aid, type, width, option1, option2, option3) {
	
	if (typeof(window['bw_album_' + aid]) == "undefined") {

		window['bw_ajax' + aid] = true;
		window['bw_album_' + aid] = new Object();
		var album = window['bw_album_' + aid];
		
		var url = "./apps/photoalbum?o=xml2&aid=" + aid;
		
		var tmp = window.location.href;
		if (tmp.match(/\/tour\//)) url = url.replace(/^\.\//, "\.\.\/");
		
		if (typeof(token) != 'undefined') url += '&token=' + token;
		
		$.ajax({
			url: url,
			context: document.body,
			success: function(xml) {
				
				if (typeof(xml) == 'object') {
					
					album.identifier = $(xml).find('aid').text();
					album.title = unescape(decodeURI($(xml).find('album_title').text()));
					album.photocount = $(xml).find('photocount').text();
					album.voting = $(xml).find('voting').text();
					var path = $(xml).find('path').text();
					album.photolist = new Object();
					
					if (album.photocount == '') {
						document.getElementById(id).style.display = 'none';
						return false;
					}
					
					$(xml).find('img').each(function() {
						
						var pid = $(this).find('pid').text();
						var ratio = $(this).find('ratio').text();
						if (ratio > 0) {
							image = album.photolist['el_' + pid] = new Object();					
							image.identifier = $(this).find('pid').text();
							image.description = unescape(decodeURI($(this).find('desc').text()));
							image.ratio = ratio;
							image.rating = $(this).find('rating').text();
							image.votes = $(this).find('votes').text();
							image.extension = $(this).find('ext').text();
							image.url = path + pid + '_#size#.' + image.extension;
							image.rate_flag = 1;
						}
					});
					album.secure = false;
					if (type == 'thumbnails') bw_createThumbnails(album, id, width, option1, option2, option3);
					else if (type == 'slideshow') bw_createSlideshow(album, id, width, option1, option2, option3);
					else if (type == 'mosaic') bw_createMosaic(album, id, width, option1, option2, option3);
					
				} else {
					album.secure = true;
					bw_insertSecure(id, aid, type);
				}				
				
				window['bw_ajax' + aid] = false;
			}
		});		
		
	} else {
	
		var album = window['bw_album_' + aid];
		if (typeof(window['bw_ajax' + aid]) != "undefined" && window['bw_ajax' + aid]) {
			setTimeout("bw_insertAlbum('"+id+"','"+aid+"','"+type+"','"+width+"','"+option1+"','"+option2+"','"+option3+"');", 100);
		} else {

			if (window['bw_album_' + aid].secure == true) bw_insertSecure(id, aid, type);
			if (type == 'thumbnails') bw_createThumbnails(album, id, width, option1, option2, option3);
			else if (type == 'slideshow') bw_createSlideshow(album, id, width, option1, option2, option3);
			else if (type == 'mosaic') bw_createMosaic(album, id, width, option1, option2, option3);
		}
	}
}


function bw_insertSecure(id, aid, type) {
	
	var d = document.getElementById(id);
	
	if (type == 'thumbnails' || type == 'mosaic') {
		d.parentNode.style.left = '0';
		d.parentNode.style.relative = 'static';
	}
	
	d.setAttribute('class', '');
	d.setAttribute('className', '');
	d.style.textAlign = 'center';
	d.style.height = 'auto';
	d.style.width = 'auto';
	d.style.background = 'none';
	
	var a = document.createElement('a');
	a.style.cursor = 'pointer';
	a.href = 'apps/photoalbum?aid=' + aid;
	a.innerHTML = 'Album requires password!';
	d.appendChild(a);
}

function bw_createContainer(s) {

	var pid = window.location.href.replace(/^.+?[?&]pid=(\d+).*$/, "$1");
	var pid_column = -1;
		
	var width_calc = bw_initDiv(s.container, s.type, s.width);
	if (width_calc != false) s.width = width_calc;
	else { 
		//alert('id: ' + s.container + ' | ' + s.step + ' | ' + s.width + ' | ' + s.swidth + ' (' + width_calc + ")\n" + document.getElementById(s.container).parentNode.innerHTML)
		if (document.getElementById(s.container).innerHTML != '') return false;
	}
	
	var album = s.album;
	var d = document.getElementById(s.container);
	if (album.photocount == 0) {
		d.parentNode.removeChild(d);
		return false;
	} 
	
	/* styles */
	if (s.type == 'slideshow') {
		
		if (s.width == '') s.width = '500';	// default
		if (s.width < 167) s.width = '167';
		if (s.width <= 300) s.ssize = 'm';	// 240px
		if (s.width > 300) s.ssize = 'l';	// 550px
		if (s.width > 600) s.ssize = 'xl';	// 1000px
		if (s.width > 1200) s.width = '1200';

		var step = Math.floor((1*s.width+7) / 82);
		s.width = step * 82 - 7;	// width of thumbnails
		s.swidth = s.width;
		
		var st = document.createElement('div');
		st.setAttribute('id', s.container + '_style');
		st.style.height = '1px';
		st.innerHTML = '&nbsp;' +
			'<style type="text/css">'+
				'#' + s.container + '.bw_album_slideshow { width: ' + s.width + 'px !important; height: ' + Math.ceil(s.width/1.667) + 'px; }' +
				'#' + s.container + '.bw_album_slideshow a, .bw_album_slideshow a:focus { width: ' + s.width + 'px !important; }' +
				'#' + s.container + '.bw_album_slideshow .bw_slideshow_column { width: ' + s.width + 'px !important; }' +
				'#' + s.container + '_bw_nav, #' + s.container + '_bw_nav ul' + ' { width: ' + (s.width) + 'px !important; }' +
			'</style>';
		insertAfter(d, st);
		
	} else if (s.type == 'thumbnails') {

		if (s.width == '') s.width = '500';	// default
		if (s.width < 164) {
			if (s.ssize == '121') s.width = '121';
			else s.width = '164';
		}
		if (s.width > 1200) s.width = '1200';
		
		// get step
		s.step = Math.floor((1*s.width+7) / s.swidth);		
		if (album.photocount < s.step) s.step = album.photocount;
		
		// set width
		s.width = s.step * s.swidth + s.outer_space;
		d.style.width = s.width + 'px';

		var st = document.createElement('div');
		st.setAttribute('id', s.container + '_style');
		st.style.height = '1px';
		st.innerHTML = '&nbsp;' +
			'<style type="text/css">'+
				'#' + s.container + '.bw_album_thumbnails { width: ' + s.width + 'px !important; }' +
				'#' + s.container + '_bw_dots' + '.bw_dots { width: ' + s.width + 'px !important; }' +
				'#' + s.container + '.bw_album_thumbnails img { width: ' + (s.swidth-7) + 'px !important; height: ' + (s.sheight-9) + 'px !important; }' +
				'#' + s.container + '.bw_album_thumbnails a { width: ' + s.swidth + 'px !important; height: ' + (s.sheight-1) + 'px !important; }' +
			'</style>';
		insertAfter(d, st);

	}
	
	// check row
	if (s.row == '' || typeof(s.row) == "undefined") s.row = 3;		// default
	if (s.row < 1) s.row = 1;		// min
	if (s.row > 100) s.row = 100;		// max
	if (s.type != 'mosaic' && album.photocount < s.row*s.step) s.row = Math.ceil(album.photocount/s.step);

	var div = document.createElement('div');
	if (s.type != 'mosaic') {
		div.style.height = (s.sheight*s.row) + 'px';
		div_width = Math.ceil(album.photocount/(s.step*s.row))*(s.step*s.swidth+s.outer_space);
		if (!div_width > 0) {
			alert('error: ' +album.photocount+"/("+s.step+'*'+s.row+'))*('+s.step+'*'+s.swidth+'+'+s.outer_space+"+1)\nwidth " + div_width + " | " + album.photocount + " | album " + typeof(s.album) + " | s.row " + s.row + " | s.sheight " + s.sheight)
			return false;
		}
		div.style.width = div_width + 'px';	
	}
	else div_width = $('#' + s.container).width();
	
	div.style.display = 'none';
	if (s.type == 'slideshow') { div.style.overflow = 'hidden'; }
	
	// create columns
	var c = 0, i = 0; 
	var column = false;
	for (var el in album.photolist) {
		
		i++;		
		var image = album.photolist[el];

		var a = document.createElement('a');
		a.setAttribute('data-ob_title', album.title);
		a.setAttribute('data-ob_caption', image.description);
		a.setAttribute('data-ob_identifier', image.identifier);
		a.setAttribute('data-ob_aid', s.aid);

		if (typeof(image.url) == "undefined") image.url = imagePath=BWPE.main.env.homepageURL+'/photoalbum/'+ s.aid + '/' + image.identifier +'_#size#.'+image.extension;
		if (typeof(image.lastChange) != "undefined" && image.lastChange != '' && !image.url.match(/nocache/)) image.url += '?nocache=' + image.lastChange;
		a.setAttribute('href', image.url.replace(/#size#/, "xl"));
	
		var imgsrcfile = 'grey.gif';
		if (s.type == 'mosaic')	imgsrcfile = 'pixel.png';
		var imgsrc = '../appfiles/photoalbum/' + imgsrcfile;
		if (typeof(BWPE) != 'undefined' || window.location.href.match(/\/members(\d*)\//) || window.location.href.match(/\/tour\//)) imgsrc = '/hp/appfiles/photoalbum/' + imgsrcfile;

		var img = document.createElement('img');
		img.setAttribute('data-original', image.url.replace(/#size#/, s.ssize));
		img.setAttribute('src', imgsrc);

		if (s.type == 'slideshow') {
			img.style.width = s.width + 'px';
			img.style.height = Math.ceil(s.width*image.ratio) + 'px';
		}

		if (s.type == 'mosaic') {
			img.setAttribute('data-ratio', image.ratio);
		}
		
		if ((s.type == 'mosaic' && column == false) || (s.type != 'mosaic' && i > c*s.row*s.step)) {
			c++;
			column = document.createElement('div');
			if (s.type == 'thumbnails') column.style.height = (s.sheight*s.row) + 'px';
			if (s.type != 'mosaic') column.style.width = (s.step*s.swidth+s.outer_space) + 'px';
			column.setAttribute('class', 'bw_' + s.type + '_column');
			column.setAttribute('className', 'bw_' + s.type + '_column');
			div.appendChild(column);
		}
		a.appendChild(img); column.appendChild(a);
		
		if (pid == image.identifier) {
			pid_column = c-1;
		}
	}	
	d.appendChild(div);	
	d.style.height = 'auto';

	if (s.type == 'slideshow') {
		
		var images = d.getElementsByTagName('img');
		
		/* max height */
		// get
		var max_height = 0;
		var sum_height = 0;
		var stats_height = new Array();
		for (var j=0; j<images.length; j++) {
			
			var image = album.photolist['el_' + images[j].parentNode.getAttribute('data-ob_identifier')];
			if (image.ratio > 1) {
				image.width = s.swidth;
				image.height = Math.ceil(image.width/image.ratio);
			} else {
				var max = s.width / image.ratio;
				if (max > s.width/1.25) max = s.width/1.25;
				image.height = Math.ceil(max);
				image.width = Math.ceil(image.height*image.ratio);
				//alert(image.width + 'x' + image.height + " | " + image.ratio + " -> max " + max + " | s.width " + s.width)
			}
			if (image.height > max_height) max_height = image.height;
		
			// save for average height
			sum_height += image.height;
			if (typeof(stats_height['height_' + image.height]) == 'undefined') stats_height['height_' + image.height] = 1;
			else stats_height['height_' + image.height]++;
			
			// set image
			images[j].style.width = image.width + 'px';
			images[j].style.height = image.height + 'px';
		}
	
		/* calc optimized height */
		// set default
		var default_height = Math.ceil(sum_height/images.length);	// avr
		var defmin_height = Math.ceil(s.width/1.667);				// min
		var defmax_height = Math.ceil(s.width/1.334);				// max
		if (default_height > defmax_height) default_height = defmax_height;
		max_height = default_height;
		
		// calc optimized
		var diff_c = 1;
		for (i in stats_height) {
			var h = i.replace(/^height_(\d+)$/, "$1");
			var diff = default_height-h*1;
			if (diff < 0) diff *= -1;
			if (diff < 100 && stats_height[i] >= diff_c) {
				diff_c = stats_height[i];
				max_height = h; 
			}
		}
		// check limit
		if (max_height == 0) max_height = defmin_height;
		else if (max_height > defmax_height) max_height = defmax_height;
		else if (max_height < 10) max_height = 10;
		/* ---------------------- */
		
		
		// set
		d.getElementsByTagName('div')[0].style.height = max_height + 'px';
		if (s.height > 0) d.getElementsByTagName('div')[0].style.height = s.height + 'px';
		
		/* set all images */
		for (var j=0; j<images.length; j++) {
		
			var image = album.photolist['el_' + images[j].parentNode.getAttribute('data-ob_identifier')];
	
			var i = images[j];
			var width = image.width;
			var height = image.height;
	
			if ((s.width-width) > (max_height-height)) {	// height > width
				
				var iwidth = Math.ceil(width/(height/max_height));
				i.width = iwidth;
				i.style.width = 'auto';
				
				i.height = max_height;
				i.style.height = max_height + 'px';
				
				var ileft = (s.width-iwidth)/2;
				i.style.left = ileft + 'px';
				
				if ($.browser.msie && $.browser.version < 8) {	// ie 6+7 
					i.style.paddingLeft = ileft + 'px'; 
					i.parentNode.style.outline = '0px';
				}
			} else {	// width > height
				
				itop = (max_height-height)/2;
				i.style.top = itop + 'px';
				
				if (($.browser.msie && $.browser.version < 8) || jQuery.support.boxModel == false) {	// ie 6+7+quirksmodus
					i.style.marginTop = itop + 'px';	
					i.parentNode.style.outline = '0px';
				}
			}
			
			// caption
			var caption = image.description;
			if (caption != '' && !($.browser.msie && $.browser.version < 8)) {
				cdiv = document.createElement('div');
				cdiv.setAttribute('class', 'caption');
				cdiv.setAttribute('className', 'caption');
				cdiv.innerHTML = caption;
				i.parentNode.appendChild(cdiv);
			}			
		}

		/* navigation */
		var nav = document.createElement('div');
		nav.setAttribute('id', s.container + '_bw_nav');
		nav.setAttribute('class', 'bw_nav');
		nav.setAttribute('className', 'bw_nav');
		var middle=shadow='';
		if (s.width > 500) {
			middle = "<div style='width: " + (s.width-500) + "px;' class='bw_nav_middle'></div>";
			shadow = " style='width: 250px;'";	
		}
		nav.innerHTML = "<div" + shadow + " class='bw_nav_right'></div><div" + shadow + " class='bw_nav_left'></div>" + middle + "<ul><li class='bw_nav_prev'></li><li class='bw_nav_toggle'></li><li class='bw_nav_next'></li></ul>"
		insertAfter(d, nav);
		
		/* events */
		$('#' + s.container + '_bw_nav .bw_nav_prev').click(function(e) {
			var p = window[s.container];
			p.pause();
			p.prev(400);
		});
		$('#' + s.container + '_bw_nav .bw_nav_next').click(function(e) {
			var p = window[s.container];
			p.pause();
			p.next(400);
		});
		$('#' + s.container + '_bw_nav .bw_nav_toggle').click(function(e) {
			var p = window[s.container];
			if (p.slideshow == 0) p.play();
			else p.pause();
		});
		
		$('#' + s.container + ' a').hover(function(){
            //$(this).find('.caption').stop().fadeTo(200, 0.85);
        },function(){
            //$(this).find('.caption').stop().fadeOut(200);
        });
	}
	else if (s.type == 'thumbnails') {
	
		// navigation: dots
		var column = Math.ceil(album.photocount/(s.step*s.row));
		if (column > 1) {
			var dots = document.createElement('ul');
			dots.setAttribute('id', s.container + '_bw_dots');
			dots.setAttribute('class', 'bw_dots');
			dots.setAttribute('className', 'bw_dots');
			for (var i=0; i<column; i++) {
				
				var dot = document.createElement('li');
				dot.setAttribute('id', s.container + '_bw_dot_' + i);
				if (i==0) {
					dot.setAttribute('class', 'bw_dot_current');
					dot.setAttribute('className', 'bw_dot_current');
				}
				dots.appendChild(dot);
			}
			insertAfter(d, dots);
		}

		$('#' + s.container + '_bw_dots.bw_dots li').click(function() {
			var p = window[s.container];
			var page = this.getAttribute('id').replace(/^.*?(\d+)$/, "$1");
			p.gotoX(page);
		});
	}
	else if (s.type == 'mosaic') {

		bw_mosaic_calcHeight(s.container, s.sheight, s.row);
		mosaic_started = true;

		$('#' + s.container).attr({
			'data-max_height': s.sheight,
			'data-row': s.row
		});

		setTimeout("bw_mosaic_check(true);", 300);
		$(window).scroll( function(){
	        bw_mosaic_check();
	    });
	}

	// register & show
	setOrangebox(s.container);
	$('#' + s.container + ' > div').fadeIn(200);
	bw_hideWait(s.type, s.container);

	// load pid
	if (pid > 0 && pid_column != -1) {
		s.start_page = pid_column;
		s.start_pid = pid;
	}
	
	// init drag
	if (s.type == 'slideshow') {
		if (!$.browser.opera)
			if (typeof(window[s.container]) != "undefined") clearInterval(window[s.container].interval);
			window[s.container] = new bw_drag(s);	
	} else if (s.type == 'thumbnails') {
		if (typeof(window[s.container]) != "undefined") clearInterval(window[s.container].interval);
		window[s.container] = new bw_drag(s);
	}

} // end of bw_createContainer

// refresh on resize
window.onresize = function() { 
	bw_mosaic_refresh();
}

function setOrangebox(id) {
	if (typeof(oB) !== 'undefined') $('#' + id + ' a').orangeBox();
	else setTimeout("setOrangebox('"+id+"')", 200);
}

function bw_createThumbnails(album, id, width, size, row) {	
	
	if (!album.identifier > 0) return false;
	window['bw_album_' + album.identifier] = album;
	
	var px = 7;
	var py = 9;
	var sizex; 
	var sizey;
	var ssize;
	if (size == '' || size == 'small') {
		sizex = 75 + px;
		sizey = 75 + py;
		ssize = 's';
	}
	else if (size == 'medium') {
		sizex = 116 + px;
		sizey = 116 + py;
		ssize = 'x2';
	}
	else if (size == 'large') {
		sizex = 157 + px;
		sizey = 157 + py;
		ssize = 'x2';
	}
	
	bw_createContainer({
		aid: album.identifier,
		album: album,
		type: 'thumbnails',
		container: id,
		width: width,
		height: 'auto',
		step: 6,	
		swidth: sizex,
		sheight: sizey,
		outer_space: 1,
		inner_space: 0,
		ssize: ssize,
		row: row,
		speed: 800
	});	
}

function bw_createSlideshow(album, id, width, speed, autostart, height) {
	
	if (!album.identifier > 0) return false;
	window['bw_album_' + album.identifier] = album;

	var navigation;
	if (autostart == 'no') navigation = 'pause';
	
	var timer; var sspeed;
	if (speed == 'slow') {
		timer = 7000;
		sspeed = 3000;
	}
	else if (speed == 'normal') {
		timer = 4500;
		sspeed = 2000;
	}	 
	else if (speed == 'fast') {
		timer = 2000;
		sspeed = 1500;
	}
	else if (speed == 'live') {
		timer = 0;
		sspeed = 12000;
	}
	
	var gheight = height;
	if (typeof(height) == 'undefined' || height == 'undefined') gheight = 'auto';
	else if (gheight < 50 || gheight > 1000) gheight = 'auto';
	
	bw_createContainer({
		aid: album.identifier,
		album: album,
		type: 'slideshow',
		width: width,
		height: gheight,
		container: id,
		step: 1,
		swidth: 500,
		sheight: 300,
		outer_space: 0,
		inner_space: 0,
		row: 1,
		speed: sspeed,
		timer: timer,
		navigation: navigation
	});
}

function bw_createMosaic(album, id, width, size, row) {

	if (!album.identifier > 0) return false;
	window['bw_album_' + album.identifier] = album;

	var sizey;
	var ssize;
	if (size == '' || size == 'small') {
		sizey = 120;
		ssize = 'm';
	}
	else if (size == 'medium') {
		sizey = 200;
		ssize = 'l';
	}
	else if (size == 'large') {
		sizey = 400;
		ssize = 'l';
	}

	bw_createContainer({
		aid: album.identifier,
		album: album,
		type: 'mosaic',
		width: width,
		height: 'auto',
		container: id,
		step: 6,
		sheight: sizey,
		outer_space: 0,
		inner_space: 0,
		row: row,
		ssize: ssize
	});
}

function bw_insertFile(url) {
	
	var tmp = window.location.href;
	if (typeof(BWPE) != 'undefined') url = url.replace(/^\.\./, "\/hp");	
	if (tmp.match(/\/members(\d*)\//)) url = url.replace(/^\.\./, "\/hp");
	if (tmp.match(/\/tour\//)) url = url.replace(/^\.\./, "\/hp");

	var f, tag, tagurl;
	if (url.match(/js(\?.+)?$/)) {
		tagname = 'script'; tagurl = 'src';
		f = document.createElement(tagname); 
		f.type = 'text/javascript'; f.src = url;
	}
	if (url.match(/css(\?.+)?$/)) {
		tagname = 'link'; tagurl = 'href';
		f = document.createElement(tagname); 
		f.type = 'text/css'; f.setAttribute('rel', 'stylesheet'); f.href = url;
	}
	
	var h = document.getElementsByTagName('head')[0], found = null;
	for (var i=0; i<h.getElementsByTagName(tagname).length; i++) if (h.getElementsByTagName(tagname)[i].getAttribute(tagurl) == url) found = 1;
	if (!found) h.appendChild(f);
	else return false;
}

function bw_hideWait(type, container) {
	var d = document.getElementById(container);
	if (d) d.style.backgroundImage = 'none';
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}


function bw_getAlbum(aid) {
	return window['bw_album_' + aid];
}
/************************/
/*** BW OBJECT VOTING ***/
/************************/

var bw_album_voting_path = "../appfiles/photoalbum/object_voting/";
if (typeof(BWPE) != 'undefined') bw_album_voting_path = bw_album_voting_path.replace(/^\.\./, "\/hp");
if (window.location.href.match(/\/members(\d*)\//) || window.location.href.match(/\/tour\//)) bw_album_voting_path = bw_album_voting_path.replace(/^\.\./, "\/hp");
var bw_album_voting_size = "normal";
function bw_album_createObjectvoting(aid, pid) {
	
	// check
	if (!aid > 0 || !pid > 0) {
		// hide
		if (document.getElementById('object_voting')) document.getElementById('object_voting').style.display = 'none';
		return false;
	}
	
	// check voting
	var album = window['bw_album_' + aid];
	if (album.voting == 'no') return false;
	
	// create div
	if (!document.getElementById('object_voting')) {
		var object_voting = document.createElement('div');
		object_voting.setAttribute('id', 'object_voting');
	    $('#ob_content').append(object_voting);
	}
	
	// set div
	var voting = document.getElementById('object_voting');
	voting.style.display = 'block';
	voting.innerHTML = '';
	voting.setAttribute('data-aid', aid);
	voting.setAttribute('data-pid', pid);
	voting.setAttribute('onmouseout', 'bw_album_set_stars_back(this)');
	
	// create stars
	for (var i=1; i<=5; i++) {
		var s = document.createElement('img');
		s.src = ''; s.title = i + '*';
		s.id = 'bwv_star_' + i + '_' + pid;
		s.setAttribute('onmouseover', 'bw_album_set_star(this)');
		s.setAttribute('onclick', 'bw_album_set_voting(this)');
		voting.appendChild(s);
	}
	
	// create status
	var status = document.createElement('div');
	status.setAttribute('class', 'bwv_status');
	status.setAttribute('className', 'bwv_status');
	voting.appendChild(status);	
	
	// set stars
	bw_album_set_stars_back(voting);
}
function bw_album_set_voting(p) {
	
	var aid = p.parentNode.getAttribute('data-aid');
	var pid = p.parentNode.getAttribute('data-pid');
	
	var album = window['bw_album_' + aid];
	var image = album.photolist['el_' + pid];
	
	var star = p.id.replace(/^bwv_star_(\d)_\d+$/, "$1");
	if (star > 0 && star <= 5) {
		$.ajax({
			url: "./apps/photoalbum?o=save_voting&objectid=" + pid + "&value=" + star + "&unique=" + pid + "&nocache="+ Math.random(),
			context: document.body,
			success: function(xml) {

				var rating = $(xml).find('rating').text();
				var votes = $(xml).find('votes').text();
				var rating_value = $(xml).find('value').text();
				var unique = $(xml).find('unique').text();
				
				// save rating if valid
				if (rating != '-1' && votes != '-1' && rating_value != '-1') {
					image.rating = rating;
					image.votes  = votes;
					image.rating_value = rating_value;
				}
				
				image.rate_flag = 0; // set rating OFF
				bw_album_set_stars_back(p.parentNode);
			}
		});	
	}	
}
function bw_album_set_star(p) {
	
	var aid = p.parentNode.getAttribute('data-aid');
	var pid = p.parentNode.getAttribute('data-pid');
	
	var album = window['bw_album_' + aid];
	var image = album.photolist['el_' + pid];
	if (image.rate_flag == 0) return false;
	
	var star = p.id.replace(/^bwv_star_(\d)_\d+$/, "$1");	
	var star_grey = bw_album_voting_path + "star_grey_" + bw_album_voting_size + ".png";
	var star_green = bw_album_voting_path + "star_green_" + bw_album_voting_size + ".png";

	for (var i = 1; i <= 5; i++) {
		var newstar = star_grey;
		if (star >= i) newstar = star_green;
		document.getElementById("bwv_star_" + i + "_" + pid).src = newstar;
	}
}
function bw_album_set_stars_back(p) {
	
	var aid = p.getAttribute('data-aid');
	var pid = p.getAttribute('data-pid');
	
	var album = window['bw_album_' + aid];
	var image = album.photolist['el_' + pid];
	
	var rating = image.rating;
	var votes = image.votes;
	
	//alert('aid ' + aid + ' | pid ' + pid + ' | rating ' + rating + ' | votes ' + votes);
	
	var star_grey = bw_album_voting_path + "star_grey_" + bw_album_voting_size + ".png";
	var star_yellow = bw_album_voting_path + "star_yellow_" + bw_album_voting_size + ".png";
	var star_yellow_half = bw_album_voting_path + "star_yellow_half_" + bw_album_voting_size + ".png";
	
	// check voting
	if (image.rate_flag == 0) {
		star_yellow = bw_album_voting_path + "star_green_" + bw_album_voting_size + ".png";
		star_yellow_half = bw_album_voting_path + "star_green_half_" + bw_album_voting_size + ".png";
		for (var i = 1; i <= 5; i++) document.getElementById("bwv_star_" + i + "_" + pid).style.cursor = "default";
		$('#object_voting .bwv_status').css('backgroundImage', "url('"+bw_album_voting_path+"status_voted.png')");
	}
	
	for (var i = 1; i <= 5; i++) {
		if (rating >= i) document.getElementById("bwv_star_" + i + "_" + pid).src = star_yellow;
		else {
			if ((rating - i + 1) >= 0.5) {
				document.getElementById("bwv_star_" + i + "_" + pid).src = star_yellow_half;	// HALF STAR
			} else {
				document.getElementById("bwv_star_" + i + "_" + pid).src = star_grey;			// EMPTY STAR
			}
		}
	}
}


var mosaic_started = false;
function bw_mosaic_getheight(images, width, margin) {

	width -= images.length * margin;  // margin
	var h = 0;
	for (var i = 0; i < images.length; ++i) {
		h += 1*( $(images[i]).attr('data-ratio') );
	}
	return width / h;
}

var mosaic_heights = [];
function bw_mosaic_setheight(images, height) {

	mosaic_heights.push(height);

	for (var i = 0; i < images.length; ++i) {
		$(images[i]).css({
			width: (height * $(images[i]).attr('data-ratio')) + 'px',
			height: height + 'px'
		}).parent().css({
			width: (height * $(images[i]).attr('data-ratio')) + 'px',
			height: height + 'px'
		});
		if (mosaic_started == false) $(images[i]).hide().css('visibility', 'visible').show();
	}
}

function bw_mosaic_calcHeight(id, max_height, row) {

	var mosaic_more = 0;
	var size = $('#' + id).width();

	var lines = -1;
	var n = 0;
	var images = $('#' + id + ' .bw_mosaic_column img');
	w: while (images.length > 0) {
		lines++;
		for (var i = 1; i < images.length + 1; ++i) {
		
			var slice = images.slice(0, i);
			var h = bw_mosaic_getheight(slice, size, 9);

			if (!$('#' + id).hasClass('bw_mosaic_show') && lines > row-1) {
				$(slice[i-1]).parent().addClass('bw_mosaic_hide');
				mosaic_more++;
			} else {
				$(slice[i-1]).parent().removeClass('bw_mosaic_hide');
			}

			if (h < max_height) {
				bw_mosaic_setheight(slice, h);
				n++;
				images = images.slice(i);

				continue w;
		 	}
		}
		bw_mosaic_setheight(slice, Math.min(max_height, h));
		n++;
		break;
	}

	if (mosaic_more > 0 && $('#' + id + ' .bw_mosaic_more').length == 0) {

		var st = document.createElement('div');
		st.setAttribute('class', 'bw_mosaic_more');
		st.setAttribute('onclick', "bw_mosaic_more('" + id + "'); return false;");
		if (typeof(BWPE) == 'undefined') st.innerHTML = bw_phrases[langid]['photoalbum_more'];
		else st.innerHTML = BWPE.page.phrases.photoalbum_show_more;
		$('#' + id).append(st);
	}
}

function bw_mosaic_more(id) {

	$('#' + id + ' a').removeClass('bw_mosaic_hide');
	$('#' + id).addClass('bw_mosaic_show'); 
	bw_mosaic_check(); 
}

function bw_mosaic_refresh() {

	$('.bw_album_mosaic').each(function() {
		
		var id = $(this).attr('id');
		var max_height = $(this).attr('data-max_height');
		var row = $(this).attr('data-row');
		$(this).css('width', 'auto');

		bw_mosaic_calcHeight(id, max_height, row);
		bw_mosaic_check();
	});
}

function bw_mosaic_check(init) {

	$('.bw_album_mosaic a:not(.bw_mosaic_hide)').each( function(i) {
        if ($(this).children().attr('data-original') && bw_mosaic_visible(this)) {
        	
        	var src = $(this).children().attr('data-original');
        	$(this).children().removeAttr('data-original');

        	$(this).children().attr('src', src);
        	if (init) $(this).children().css('visibility', 'visible');
        	if (!init) $(this).children().css({'visibility': 'visible', 'opacity': '0'}).delay(300).animate({'opacity':'1'}, 200);
        }
    });
}

function bw_mosaic_visible(this_p) {

	var height_of_object = $(this_p).outerHeight()
	var bottom_of_object = $(this_p).offset().top; //  + height_of_object;
    var bottom_of_window = $(window).scrollTop() + $(window).height();

    var half_of_object = $(this_p).offset().top + height_of_object/2;
    if (bottom_of_window > bottom_of_object || (height_of_object > 200 && bottom_of_window > half_of_object)) {
        return true;
    } else {
		return false;
    }
}
