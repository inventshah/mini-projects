import javax.swing.JButton;
import javax.swing.JColorChooser;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

// A JButton to change color of the Fractal
public class ColorButton extends JButton implements ActionListener
{
	private DrawingPanel drawing;
	public ColorButton(String name, DrawingPanel dp)
	{
		super(name);
		addActionListener(this);
		setText(name);
		drawing = dp;
	}

	public void actionPerformed(ActionEvent e)
	{
		Color color = JColorChooser.showDialog(this, "Select a color", drawing.getColor(getText()));
		drawing.setColor(getText(), color);
		drawing.draw();
	}
}