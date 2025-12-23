---
title: Charlotte-Markdown
published: 2018-10-30
description: 'Charlotte-Markdown 是 Charlotte 主题的 Markdown 语法说明文档'
image: './Markdown.webp'
tags: [Charlotte, 公告, Markdown]
category: '公告'
draft: false 
lang: ''
---
# Charlotte-Markdown 使用说明

>本文直接参考[Fuwari](https://github.com/saicaca/fuwari)的相关指南

~~其实是为了防止未来的自己忘了该怎么写Post~~


封面： [Collector](https://www.pixiv.net/artworks/133535742) by [Ashima](https://www.pixiv.net/users/2642047)

# 创建文章

## 文章元数据

```
---
title: Charlotte-Markdown
published: 2018-10-30
description: 'Charlotte-Markdown 是 Charlotte 主题的 Markdown 语法说明文档'
image: './Markdown.webp'
tags: [Charlotte, 公告, Markdown]
category: '公告'
draft: false 
lang: ''
---
```

| 属性名 | 描述 |
| --- | :-- |
| `title` | 文章标题 |
| `published` | 文章发表时间 |
| `description` | 文章简介。 会显示在主页上 |
| `image` | 文章封面图   1\. 以 `http://` or `https://`开头: 使用网络图片   2\. 以 `/`: 开头来使用 `public` 中的图片   3\. 没有任何前缀：使用相对于Markdown文件的图片 |
| `tags` | 文章的标签 |
| `category` | 文章的分类 |
| `draft` | `true`或者`false`。是否为草稿。如果为`true`，则不会显示在主页上。 |

## 发布文章的存放位置

你发布的文章应当在 `src/content/posts/` 目录下. 你也可以创建一个子目录，用来存放文章和文章中的资源。

```shell
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

# Markdown 语法

# 这是一个 h1 标题

## 这是一个 h2 标题

### 这是一个 h3 标题

段落之间用空行分隔。（或双空格+换行进行内部换行）

这是第二段 *斜体*、**粗体**和 `代码行`。

# 无序列表

-   这是一项
-   这是一项
-   这是另一项

# 有序列表

1.  第一项
2.  第二项
3.  第三项

# 嵌套列表

1.  首先有这两个对象
    
    -   你
    -   我
2.  一定要记住
    
3.  不能忘
    
     `找到我`
    
    说晚安

# 链接和脚注

这里有一个链接到 [一个网站](http://bilibili.com)、[本地文档](example.md) 和 [当前文档中的某个章节标题](#这是一个-h3-标题)。这里有一个脚注[^1]。

[^1]: 这是脚注的示例内容，点击脚注引用会跳转到这里。（显示在Post最后）

# 图片引用

## Markdown 语法引入图片

示例：
```markdown
![头像图片](/favicon/icon_256.webp "我的头像")
```
![头像图片](/favicon/icon_256.webp "我的头像")

## HTML 标签引入图片

示例：
```html
<img src="/favicon/icon_256.webp" alt="头像图片" width="256" height="256" />
```
<img src="/favicon/icon_256.webp" alt="头像图片" width="256" height="256" />

## 路径说明

图片路径有以下几种方式：

1. **网络图片**：以 `http://` 或 `https://` 开头
   ```markdown
   ![网络图片](https://example.com/image.jpg)
   ```

2. **公共目录图片**：以 `/` 开头，相对于 `public` 目录
   ```markdown
   ![公共图片](/favicon/icon_256.webp)
   ```

3. **相对路径图片**：相对于当前 Markdown 文件的位置
   ```markdown
   ![相对图片](./images/photo.jpg)
   ```

# 数学公式

行内数学公式是这样写的：$\omega = d\phi / dt$。

显示数学公式应该独占一行，用双美元符号包裹：

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;\ldots
\end{equation*}
$$

# GitHub 仓库卡片

你可以添加一个链接到一个 GitHub 仓库的动态卡片。当页面加载时，将从 GitHub API 获取仓库信息。

::github{repo="ChuwuYo/Charlotte"}

创建一个 Github 仓库卡片，只需在 Markdown 文件中添加一行 `::github{repo="<owner>/<repo>"}`。

```markdown
::github{repo="ChuwuYo/Charlotte"}
```

# 警告

支持这些类型的警告: `note` `tip` `important` `warning` `caution`

:::note
突出显示用户在浏览时也应考虑的信息。
:::

:::tip
可选的信息，以帮助用户更顺利地理解。
:::

:::important
用户完成任务所必需的关键信息。
:::

:::warning
关键内容，由于潜在风险需要用户立即关注。
:::

:::caution
行动的负面潜在后果。
:::

## 基本语法

```markdown
:::note
突出显示用户在浏览时也应考虑的信息。
:::

:::tip
可选的信息，以帮助用户更顺利地理解。
:::
```

## 自定义标题

警告的标题可以自定义。

:::note[自定义标题]
这是一个带有自定义标题的提示。
:::

```markdown
:::note[自定义标题]
这是一个带有自定义标题的提示。
:::
```
## GitHub 语法
> [!TIP]
> 同时也支持 [GitHub 语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> 也支持 GitHub 语法。

> [!TIP]
> 也支持 GitHub 语法。
```

# 剧透内容

你可以为文本添加剧透。文本也支持 **Markdown** 语法。

内容 :spoiler[被隐藏起来了 **哈哈**]！

```markdown
内容 :spoiler[被隐藏起来了 **哈哈**]！
```

# 视频卡片

只需从 YouTube 或其他平台复制嵌入代码，然后将其粘贴到 markdown 文件中。

### YouTube

只需从 YouTube 复制嵌入代码，然后粘贴到 Markdown 文件中即可。

<iframe width="560" height="315" src="https://www.youtube.com/embed/1MsuXjTlCGE?si=KykaK5Bgvq1W1hXI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


# 杂项

## 特殊符号

- **长破折号**：使用三个破折号 `---` 表示长破折号（——）
- **范围符号**：使用两个破折号 `--` 表示范围（例如，"第 12—14 章"）
- **省略号**：三个点 `...` 将被转换为省略号（……）

## Unicode 支持

支持 Unicode 字符，例如表情符号：☺ ★ ♥ ♦ ♣ ♠ ● ○ ◇ ◆ □ ■ △ ▲ ※ → ← ↑ ↓

## 转义字符

如果需要显示特殊字符的原样，可以使用反斜杠 `\` 进行转义：

- `\_` 显示为 `_`（而不是斜体）
- `\*` 显示为 `*`（而不是粗体）
- `\`` 显示为 `` `（而不是代码）

## 缩进

缩进始终保持为四个空格的距离，你也可以使用制表符（Tab）。

## 行块

| 第一行
| 第二行
| 第三行