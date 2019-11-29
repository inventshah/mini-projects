import javax.swing.JSlider;

import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

// A Jsilder to change the angle of the Fractal
public class AnglePicker extends JSlider implements ChangeListener
{
	private DrawingPanel drawing;
	public AnglePicker(DrawingPanel dp)
	{
		super(0, 90, 45);
		setPaintTrack(true); 
		setPaintTicks(true); 
		setPaintLabels(true); 

		setMajorTickSpacing(9);

		addChangeListener(this);

		drawing = dp;
	}

	public void stateChanged(ChangeEvent e)
	{
		double angle = (90 - getValue()) * Math.PI / 180.0;
		Branch.setAngle(angle);
		drawing.reset();
	}
}