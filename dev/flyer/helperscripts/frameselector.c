#include <acknex.h>
#include <default.c>

ENTITY* active;
BMAP* arrow = "arrow.tga";
var count;

void camera_rst()
{
	camera->pan = 180;
	camera->tilt = 0;
	camera->roll = 0;	
}

void anim_rst()
{
	/*ENTIY* ent;
	for (ent = ent_next(NULL); ent != NULL; ent = ent_next(ent))
	{
		ent_animate(ent, NULL, 0, 0);		
	}*/
	if (active != NULL)
		ent_animate(active, NULL, 0, 0);		
}

void add_vmask()
{
	if (active)
	 active->vmask++;
}

void sub_vmask()
{
	if (active)
	 active->vmask--;
}

void main()
{
	video_mode = 12;
	video_screen = 1;
	mouse_mode = 4;
	wait(1);
	vec_set(sky_color, vector(255, 0, 255));
	level_load("helper.wmb");
	on_r = camera_rst;
	on_t = anim_rst;
	on_v = add_vmask;
	on_c = sub_vmask;
	mouse_map = arrow;
	while(count < 160)
	{
		draw_text("LMB - anim fwd (+ SHIFT - faster) | RMB - anim bwd (+ SHIFT - faster) | T - reset to default pose | R - reset camera angle)", 20,40, vector(255,255,255));
		count+= time_step;
		wait(1);
	}
}

void frameclicker_ev()
{
	if (event_type == EVENT_CLICK)
	{
		my->frame = cycle(my->frame + (1 + 4 * key_shift), 0, ent_frames(me) - 1);	
		my->skill30 = cycle(my->skill30 + (1 + 4 * key_shift), 0, 100);
		ent_animate(me, my->string1, my->skill30, ANM_CYCLE);
		active = me;
	}	
	
	if (event_type == EVENT_RIGHTCLICK)
	{
		my->frame = cycle(my->frame - (1 + 4 * key_shift), 0, ent_frames(me) - 1);	
		my->skill30 = cycle(my->skill30 - (1 + 4 * key_shift), 0, 100);
		ent_animate(me,my->string1, my->skill30, ANM_CYCLE);
		active = me;
	}
}

action frameclicker()
{
	my->frame = 0;
	my->event = frameclicker_ev;
	my->emask |= ENABLE_CLICK | ENABLE_RIGHTCLICK;
	wait(1);
	my->vmask |= my->skill1;
	while(1)
	{
		wait(1);
	}
}