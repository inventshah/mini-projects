import javax.swing.JComponent;
import javax.swing.JPanel;

// Wrap buttons in one panel
public class ComponentWrapper extends JPanel
{
	public ComponentWrapper(JComponent... elements)
	{
		for (JComponent elm : elements)
		{
			add(elm);
		}
	}
}