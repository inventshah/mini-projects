import javax.swing.JButton;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

// A JButton to add branches to the tree
public class AddButton extends JButton implements ActionListener
{
	private DrawingPanel drawing;
	public AddButton(DrawingPanel dp)
	{
		super("Add");
		addActionListener(this);
		setText("Add");
		drawing = dp;
	}

	public void actionPerformed(ActionEvent e)
	{
		drawing.branch();
		drawing.draw();
	}
}