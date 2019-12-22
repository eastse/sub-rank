export class cc {
	/**
	 * 获取一个矩形
	 * @param x 矩形 X 轴上坐标
	 * @param y 矩形 Y 轴上坐标
	 * @param width 矩形宽度
	 * @param height 矩形高度
	 */
	public static rect(x: number, y: number, width: number, height: number): Rect {
		let rect: Rect = {
			x,
			y,
			width,
			height,
			contains: (point: Vec2) => {
				return (x <= point.x &&
					x + width >= point.x &&
					y <= point.y &&
					y + height >= point.y);
			}
		};
		return rect;
	}

	/**
	 * 创建一个2D向量
	 * @param x X 坐标
	 * @param y Y 坐标
	 */
	public static v2(x: number = 0, y: number = 0): Vec2 {
		return { x, y };
	}

	/**
	 * 矩阵乘法
	 * @param a 
	 * @param b 
	 */
	public static matMul(a: number[], b: number[]) {
		let rs = []
		for (let i = 0; i < a.length; i += 3) {
			for (let m = 0; m < 3; m++) {
				let sum = 0
				for (let j = i; j < i + 3; j++) {
					sum += a[j] * b[j % 3 * 3 + m]
				}
				rs.push(sum)
			}
		}
		return rs
	}

}