# CSLB 备考

面向华人承包商的加州 CSLB 承包商执照备考网站：中英对照题库、限时模拟考试、知识点讲义和执照申请指南。网站界面、解析、讲义和指南都有中文和英文两个版本，页头一键切换。

Bilingual (Chinese/English) California CSLB license prep: practice questions, timed mock exams, study notes and a license guide.

- **章节练习** `practice.html`：按 CSLB 考试大纲分部分练习，当场解析，错题本保存在本机浏览器
- **模拟考试** `exam.html`：限时整套，交卷后按部分出分
- **知识点讲义** `notes.html`：关键数字、期限和规范要点
- **申请指南** `guide.html`：申请步骤、费用、免考、外聘 RME

## 结构

纯静态网站，无需构建，直接部署到 Vercel 或任何静态托管。

```
index.html  practice.html  exam.html  notes.html  guide.html
assets/site.css   assets/app.js      页面样式、页头页脚和答题引擎
content/questions.js                  题库数据（window.QUESTIONS）
```

## 添加题目

在 `content/questions.js` 的 `QUESTIONS` 数组里追加一项：

```js
{id:'L37', x:'law', t:'con',             // x: law | b；t: TOPICS 里的部分
 q:'English stem', z:'中文题干',
 o:[['A','甲'],['B','乙'],['C','丙'],['D','丁']],
 a:1,                                    // 正确选项序号，从 0 开始
 e:'中文解析', ee:'English explanation'}
```

本地检查：`node scripts/check.js`

## 许可

- 代码：MIT（见 `LICENSE`）
- 题库与讲义文字：CC BY-NC-SA 4.0（见 `content/LICENSE`）

本项目与加州承包商执照委员会（CSLB）无关。题目为根据公开法规原创编写的练习题，不是 CSLB 真题；正式信息以 [cslb.ca.gov](https://www.cslb.ca.gov) 为准，不构成法律意见。

## 审核

`content/review/review-all.csv` 是全部题目的审核表（英文题干、正确答案、解析、出处），请持证承包商逐题填写 Reviewer OK 和意见。每加一批题都重新生成。
