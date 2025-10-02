/**
 * Swup集成工具函数
 * 用于统一处理组件在页面转换时的初始化逻辑
 *
 * 这个函数可以在Astro组件的script标签中直接复制使用，
 * 避免了import的问题，同时提供了统一的Swup集成模式
 */

/**
 * 通用的Swup兼容初始化模式
 * 复制这个函数到你的Astro组件script标签中使用
 *
 * @param initFunction 需要执行的初始化函数
 */
export function createSwupHandler(initFunction: () => void): void {
	// 页面加载时初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initFunction);
	} else {
		initFunction();
	}

	// 处理 Swup 页面转换
	if (typeof window !== "undefined") {
		const setupSwup = () => {
			if (window?.swup?.hooks) {
				window.swup.hooks.on("page:view", initFunction);
			}
		};

		if (window.swup) {
			setupSwup();
		} else {
			document.addEventListener("swup:enable", setupSwup);
		}
	}
}

/**
 * 通用的Swup兼容初始化模式 - 内联版本
 * 直接复制这段代码到你的Astro组件中，替换initFunction为你的初始化函数
 */
export const SWUP_HANDLER_TEMPLATE = `
// 通用的Swup兼容初始化模式
function createSwupHandler(initFunction: () => void) {
    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFunction);
    } else {
        initFunction();
    }
    
    // 处理 Swup 页面转换
    if (typeof window !== 'undefined') {
        const setupSwup = () => {
            if (window?.swup?.hooks) {
                window.swup.hooks.on('page:view', initFunction);
            }
        };
        
        if (window.swup) {
            setupSwup();
        } else {
            document.addEventListener('swup:enable', setupSwup);
        }
    }
}
`;

/**
 * 为定时器提供Swup兼容的管理
 * @param timerFunction 定时器函数
 * @param interval 定时器间隔（毫秒）
 * @returns 清理函数
 */
export function createSwupCompatibleTimer(
	timerFunction: () => void,
	interval: number,
): () => void {
	let timerId: ReturnType<typeof setInterval> | null = null;

	const startTimer = () => {
		// 清理之前的定时器
		if (timerId) {
			clearInterval(timerId);
		}

		// 立即执行一次
		timerFunction();

		// 启动定时器
		timerId = setInterval(timerFunction, interval);
	};

	const cleanup = () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		}
	};

	// 注册Swup处理器
	createSwupHandler(startTimer);

	// 页面卸载时清理
	window.addEventListener("beforeunload", cleanup);

	// 返回清理函数
	return cleanup;
}
