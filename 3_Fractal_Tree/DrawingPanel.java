// Sachin
// Fractal Tree Generation, press 's' to screenshot
// compile and run:
// javac DrawingPanel.java && java DrawingPanel

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import java.io.File;

import java.util.ArrayList;

import javax.imageio.ImageIO;

import javax.swing.AbstractAction;
import javax.swing.ActionMap;
import javax.swing.InputMap;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.KeyStroke;

public class DrawingPanel extends JPanel
{
	public static void main(String args[])
	{
		DrawingPanel dp = new DrawingPanel();
	}

	// Pop up window dimensions
	private int windowWidth = 400;
	private int windowHeight = 500;

	private int width = 400;
	private int height = 400;

	// Window's background color
	private Color background = new Color(146, 223, 232);

	// Window compenents
	private JFrame frame;

	private ArrayList<Branch> tree = new ArrayList<>();
	private int numberBranches = 0;

	public DrawingPanel()
	{
		frame = new JFrame("Fractal Tree");
		AddButton addButton = new AddButton(this);
		ColorButton backgroundColor = new ColorButton("Background Color", this);
		ColorButton branchColor = new ColorButton("Branch Color", this);
		AnglePicker anglePicker = new AnglePicker(this);

		ComponentWrapper buttons = new ComponentWrapper(addButton, backgroundColor, branchColor);

		frame.getContentPane().add(this, BorderLayout.CENTER);
		frame.getContentPane().add(buttons, BorderLayout.SOUTH);
		frame.getContentPane().add(anglePicker, BorderLayout.NORTH);

		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(windowWidth, windowHeight);
		frame.setBackground(background);
		frame.setVisible(true);

		Branch root = new Branch(width / 2, height - 50, width / 2, height - 150, 5);
		tree.add(root);
		Branch[] temp = root.branch();
		tree.add(temp[0]);
		tree.add(temp[1]);

		setKeyBinder();
	}

	// If a branch need's to split, split it
	public void branch()
	{
		for (int i = tree.size() - 1; i > 0; i--)
		{
			if (tree.get(i).shouldBranch())
			{
				Branch[] temp = tree.get(i).branch();
	
				tree.add(temp[0]);
				tree.add(temp[1]);
			}
			else
			{
				break;
			}
		}

		numberBranches++;
	}

	public void setColor(String s, Color c)
	{
		if (s.contains("Background"))
		{
			background = c;
		}
		else if (s.contains("Branch"))
		{
			Branch.setColor(c);
		}
	}

	public Color getColor(String s)
	{
		if (s.contains("Background"))
		{
			return background;
		}
		else if (s.contains("Branch"))
		{
			return Branch.getColor();
		}

		return Color.BLACK;
	}

	public void reset()
	{
		Branch root = tree.get(0);
		tree = new ArrayList<>();

		tree.add(root);
		Branch[] temp = root.branch();
		tree.add(temp[0]);
		tree.add(temp[1]);

		int reps = numberBranches;
		numberBranches = 0;
		for (int i = 0; i < reps; i++)
		{
			branch();
		}

		draw();
	}

	// Reset the background, and braw the tree
	@Override
	public void paint(Graphics g)
	{
		g.setColor(background);
		g.fillRect(0, 0, width, height);

		for (Branch branch : tree)
		{
			branch.draw(g);
		}

	}

	public void draw()
	{
		this.repaint(0, 0, width, height);
	}

	// Save the current graphics view as a png file
	public void screenshot()
	{
		BufferedImage img = new BufferedImage(this.getWidth(), this.getHeight(), BufferedImage.TYPE_INT_ARGB);
		Graphics2D graphics = img.createGraphics();

		this.print(graphics);

		try
		{
			ImageIO.write(img, "png", new File("tree.png"));
		}
		catch (Exception e)
		{
			System.out.println("Failed to save the tree");
			e.printStackTrace();
		}
	}

	// Set the 's' key as the screenshot key
	private void setKeyBinder()
	{
		int map = JComponent.WHEN_IN_FOCUSED_WINDOW;

		InputMap iMap = getInputMap(map);
		ActionMap aMap = getActionMap();

		KeyStroke sKey = KeyStroke.getKeyStroke('s');
		iMap.put(sKey,"s");
		aMap.put("s", this.new sKey(this));

		requestFocus();
	}

	// 's' key action definition
	private class sKey extends AbstractAction
	{
		DrawingPanel drawing;
		public sKey(DrawingPanel dp)
		{
			drawing = dp;
		}
		public void actionPerformed(ActionEvent e)
		{
			drawing.screenshot();
		}
	}
}