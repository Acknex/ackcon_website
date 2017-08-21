var pic_id = 0;
var gallery_active = 0;
var current_gallery = 0;
var xDown = null;
var yDown = null;

window.onresize = gallery_size;
window.onload = gallery_size;
document.onkeyup = keyPressed;
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function gallery_size()
{
    //automatically adapt size of gallery image
    if (typeof (pictures) !== 'undefined')
    {
        update_image();
    }
}

function gallery_next()
{
    if (pictures != null && pictures[current_gallery] != null && gallery_active != 0)
    {
        pic_id++;
        pic_id = pic_id >= pictures[current_gallery].length ? 0 : pic_id;
        swap_image(); //switch to new image
    }
}

function gallery_prev()
{
    if (pictures != null && pictures[current_gallery] != null && gallery_active != 0)
    {
        pic_id--;
        pic_id = pic_id < 0 ? pictures[current_gallery].length - 1 : pic_id;
        swap_image(); //switch to new image
    }
}

function gallery_open(gallery_id, picture_id)
{
    if (pictures != null && gallery_active == 0)
    {
        pic_id = picture_id;
        current_gallery = gallery_id;

        swap_image();
        gallery_active = 1;

        document.getElementById('gallery_popup').className = 'active';
        document.getElementById('gallery_overlay').className = 'active';
    }
}

function gallery_close()
{
    if (gallery_active != 0)
    {
        gallery_active = 0;

        document.getElementById('gallery_popup').className = '';
        document.getElementById('gallery_overlay').className = '';
    }
}

function swap_image()
{
    var tmp_image = document.getElementById('gallery_image');
    tmp_image.src = ''; //avoid short popup of last image while loading new one
    update_image();
    tmp_image.src = pictures[current_gallery][pic_id][0]; //now set new image
}

function update_image()
{
    //borders and sizes for gallery popup
    var nav_height = 30;
    var top_border = 50; // 50px top
    var bottom_border = 20; // 20px bottom
    var side_border_big = 60; // 30px left/right
    var side_border_small = 20; // 10px left/right

    var height = window.innerHeight ||
            (window.document.documentElement.clientHeight ||
                    window.document.body.clientHeight);

    var width = window.innerWidth ||
            (window.document.documentElement.clientWidth ||
                    window.document.body.clientWidth);
    var new_width = pictures[current_gallery][pic_id][1];
    var new_height = pictures[current_gallery][pic_id][2];

    //leave away border for small displays
    if (width > 500)
        var max_width = width - side_border_big;
    else
        var max_width = width - side_border_small;

    var max_height = height - nav_height;
    if (height > 500)
        max_height -= (bottom_border + top_border);
    else
        top_border = 0;

    var fac_x = new_width / max_width;   // fac_x > 1 : image too wide
    var fac_y = new_height / max_height; // fac_y > 1 : image too high

    //limit image size
    if (fac_x > 1 && fac_x > fac_y)
    {
        var tmp_width = max_width;
        var tmp_height = Math.round(new_height * (max_width / new_width));
    } else if (fac_y > 1 && fac_y > fac_x)
    {
        var tmp_height = max_height;
        var tmp_width = Math.round(new_width * (max_height / new_height));
    } else
    {
        var tmp_width = new_width;
        var tmp_height = new_height;
    }

    //adapt size of image popup
    var gallery_popup = document.getElementById('gallery_popup').style;
    gallery_popup.width = tmp_width + 'px';
    gallery_popup.height = tmp_height + nav_height + 'px';
    gallery_popup.top = top_border + 'px';
    gallery_popup.left = Math.max(0, Math.round((width - tmp_width) * 0.5)) + 'px';

    //adapt size of nav bar
    var gallery_nav = document.getElementById('gallery_nav').style;
    gallery_nav.width = tmp_width + 'px';
    gallery_nav.height = 30 + 'px';

    //adapt size of image box
    var gallery_img = document.getElementById('gallery_img').style;
    gallery_img.width = tmp_width + 'px';
    gallery_img.height = tmp_height + 'px';

    //adjust size of image
    var gallery_image = document.getElementById('gallery_image');
    gallery_image.width = tmp_width;
    gallery_image.height = tmp_height;
}

function keyPressed(e)
{
    if (!e)
        e = window.event;

    if (e.which)
        numkey = e.which;
    else if (e.keyCode)
        numkey = e.keyCode;
    else
        numkey = 0;

    var anchors = document.getElementsByTagName('a');

    for (var i = 0; i < anchors.length; i++)
    {
        if (anchors[i].getAttribute('id') == 'key' + numkey)
        {
            document.location = anchors[i].href;
            break;
        }
    }
}

function handleTouchStart(e)
{
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;

    var touched_element = document.elementFromPoint(xDown, yDown);
    var gallery_image = document.getElementById('gallery_image');
    if (touched_element !== gallery_image)
    {
        xDown = null;
        yDown = null;
    }
}

function handleTouchMove(e)
{
    if (!xDown || !yDown)
    {
        return;
    }

    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff))
    {
        if (xDiff > 0)
        {
            document.location = 'javascript: gallery_next()';
        } else
        {
            document.location = 'javascript: gallery_prev()';
        }
    } 
    /* reset values */
    xDown = null;
    yDown = null;
}