# CSLB 备考 · CSLB Prep

**网站：<https://cslb.vercel.app>**

面向华人承包商的加州 CSLB 承包商执照备考网站，免费、开源、不用注册。网站有中文、英文、西班牙语三个版本，页头一键切换。

A free, open-source study site for the California contractor license (CSLB) exams, built for Chinese-speaking contractors and available in English, Chinese and Spanish.

## 功能

| 页面 | 内容 |
|---|---|
| [章节练习](https://cslb.vercel.app/practice.html) | 按 CSLB 考试大纲分部分练习，答完马上看解析和出处，错题自动进错题本 |
| [模拟考试](https://cslb.vercel.app/exam.html) | 法律与商务、B 类专业或两门混合，限时作答，交卷后按部分出分 |
| [知识点讲义](https://cslb.vercel.app/notes.html) | 考试常考的数字、期限和规范要点 |
| [申请指南](https://cslb.vercel.app/guide.html) | 申请步骤、时间、费用、免考、外聘 RME、官方链接 |

- 题干和选项是考试风格的英文（真实考试只有英文和西班牙语），可切换中文或西班牙语对照。
- 选项每次随机排序，避免记位置。
- 错题本和语言选择只存在本机浏览器里，网站不收集任何个人信息。

## 题库

共 **301 题**，全部根据公开的法规、规范和 CSLB 学习指南原创编写，**不是 CSLB 真题**。每题都附中英西三语解析和出处链接（法条、Title 8、加州建筑规范或 CSLB 文件）。

| 法律与商务（169） | 题数 | B 类总包（132） | 题数 |
|---|---:|---|---:|
| 企业组织与执照 | 37 | 计划与估算 | 26 |
| 企业财务 | 26 | 结构与框架 | 27 |
| 用工 | 26 | 主体施工（混凝土、机电、屋面等） | 38 |
| 保险与留置权 | 23 | 装修与防火 | 26 |
| 合同 | 19 | 施工安全 | 16 |
| 公共工程 | 15 | | |
| 安全 | 22 | | |

信息以 2026 年 11 月的法规为准。法规每年会变（例如执照门槛 2025 年起提高到 $1,000），使用时请以 [cslb.ca.gov](https://www.cslb.ca.gov) 为准。

## 目录结构

纯静态网站，不需要构建，可以直接部署到 Vercel、GitHub Pages 或任何静态托管。

```
index.html  practice.html  exam.html  notes.html  guide.html
assets/site.css                 样式
assets/app.js                   页头页脚、语言切换、答题和考试引擎
content/questions.js            题库（英文、中文、解析、出处）
content/questions.es.js         西班牙语题干、选项和解析（按题号）
content/review/review-all.csv   审核表
content/LICENSE                 题库和文字内容的许可
scripts/check.js                题库格式检查
```

## 本地运行

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 添加或修改题目

1. 在 `content/questions.js` 的 `QUESTIONS` 数组末尾加一项：

```js
{id:'L169', x:'law', t:'con',            // x: law | b；t: 所属部分，见文件开头的 TOPICS
 q:'English stem', z:'中文题干',
 o:[['Option A','选项甲'],['Option B','选项乙'],['Option C','选项丙'],['Option D','选项丁']],
 a:0,                                    // 正确选项的序号，从 0 开始
 e:'中文解析', ee:'English explanation',
 s:['B&P Code §7159','https://leginfo.legislature.ca.gov/...']}   // 出处名称和链接，必填
```

2. 在 `content/questions.es.js` 的 `QUESTIONS_ES` 里按题号加西班牙语：

```js
L169:['Enunciado en español', ['Opción A','Opción B','Opción C','Opción D'], 'Explicación'],
// 选项顺序和英文一致；纯数字选项可以写 null，直接显示英文
```

3. 运行检查，确认题号不重复、格式正确、每题都有出处：

```bash
node scripts/check.js
```

出题原则：
- 每题都要先查原文，写清出处，不凭印象出题。
- 不抄 CSLB 学习指南原文、商业题库或 PSI 样题；建筑规范只写条文号和要点。
- 不收录考生回忆的真题（考生签过保密协议）。

## 审核

`content/review/review-all.csv` 列出全部题目的题干、正确答案、解析和出处，最后两列留给审核人填写 Reviewer OK (Y/N) 和意见。欢迎持证承包商、备考老师逐题审核；西班牙语欢迎母语者校对。发现错误请提 [Issue](https://github.com/sissit/cslb/issues) 或 Pull Request。

## 部署

仓库连接 Vercel，推送到 `main` 分支后自动部署到 <https://cslb.vercel.app>。

## 许可

- 代码：MIT，见 [`LICENSE`](LICENSE)
- 题库、讲义和指南文字：CC BY-NC-SA 4.0，见 [`content/LICENSE`](content/LICENSE)。可以转载和改编，但须署名、不得商用，并以相同许可分享。

## 免责声明

本项目与加州承包商执照委员会（CSLB）没有任何关系，也未获其认可。内容仅供学习，不构成法律意见。执照申请和法规要求请以 [cslb.ca.gov](https://www.cslb.ca.gov) 和律师意见为准。

This project is not affiliated with or endorsed by the Contractors State License Board. Questions are original practice items, not actual exam questions. Not legal advice.
