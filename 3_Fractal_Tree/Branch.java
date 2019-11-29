import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.geom.Line2D;
import java.awt.Graphics;
import java.awt.Graphics2D;

import java.util.ArrayList;

public class Branch
{
	// Constants for creating new branches to the left and right
	private static final double deg90 = Math.PI / 2.0;
	private static double deg45 = Math.PI / 4.0;
	private static double cosl = Math.cos(deg45 + deg90);
	private static double sinl = Math.sin(deg45 + deg90);

	private static double cosr = Math.cos(-(deg45 + deg90));
	private static double sinr = Math.sin(-(deg45 + deg90));

	// Scale each branch smaller than the last
	private static final double scale = 0.7;
	private static final float strokeScale = 0.8f;

	// Color of the branch (Brownish)
	private static Color color = new Color(117, 83, 9);

	public static Color getColor()
	{
		return color;
	}
	public static void setColor(Color c)
	{
		color = c;
	}

	public static void setAngle(double angle)
	{
		cosl = Math.cos(angle + deg90);
		sinl = Math.sin(angle + deg90);

		cosr = Math.cos(-(angle + deg90));
		sinr = Math.sin(-(angle + deg90));
	}

	// start and end points - (x1, y1), (x2, y2)
	private int x1, y1, x2, y2;

	// Branch thinkness
	private float stroke;

	// Has the branch already grown to the next level 
	private boolean shouldBranch;

	public Branch(int x1, int y1, int x2, int y2, float stroke)
	{
		this.x1 = x1;
		this.y1 = y1;

		this.x2 = x2;
		this.y2 = y2;

		this.stroke = stroke;

		this.shouldBranch = true;
	}

	// Draw a line for (x1, y1) to (x2, y2)
	public void draw(Graphics g)
	{
		g.setColor(color);

		Graphics2D g2 = (Graphics2D) g;
		g2.setStroke(new BasicStroke(stroke));

		g2.draw(new Line2D.Float(x1, y1, x2, y2));
	}

	public boolean shouldBranch()
	{
		return shouldBranch;
	}

	// Creat 2 new branches to the left and right from this one
	public Branch[] branch()
	{
		int xprime = x1 - x2;
		int yprime = y1 - y2;

		int px = (int) ((xprime * cosl - yprime * sinl) * scale) + x2;
		int py = (int) ((xprime * sinl + yprime * cosl) * scale) + y2;

		Branch left = new Branch(x2, y2, px, py, stroke * strokeScale);

		px = (int) ((xprime * cosr - yprime * sinr) * scale) + x2; 
		py = (int) ((xprime * sinr + yprime * cosr) * scale) + y2;
		Branch right = new Branch(x2, y2, px, py, stroke * strokeScale);

		shouldBranch = false;
		return new Branch[] {left, right};
	}
}