# CSLB 备考 · CSLB Prep

**<https://cslbexam.org>** · [中文](https://cslbexam.org/zh/) · [Español](https://cslbexam.org/es/)

面向华人承包商的加州 CSLB 承包商执照免费备考网站，中文、英文、西班牙语三语。
A free California contractor license (CSLB) study site in English, Chinese and Spanish.

- **章节练习**：按考试大纲分部分练习，附解析、出处和错题本
- **模拟考试**：法律与商务、B 类总包，限时作答，按部分出分
- **知识点讲义**：常考的数字、期限和规范要点
- **申请指南**：申请步骤、材料、费用、免考和考试

## 修改页面

页面源文件在 `src/`（每页含三种语言）。改完运行 `python3 scripts/build.py`，生成英文版（根目录）、`zh/`、`es/`、各章讲义页和 sitemap。不要直接改生成的文件。

## 添加题目

在 `content/questions.js` 加题，在 `content/questions.es.js` 按题号加西语，然后运行 `node scripts/check.cjs` 检查。格式参照文件里已有的题目，每题都要写出处。

发现错误欢迎提 [Issue](https://github.com/sissit/cslb/issues)。

## 许可

代码 MIT；题库和文字 CC BY-NC-SA 4.0。

本项目与 CSLB 无关，题目为原创练习题，不是真题，不构成法律意见。正式信息以 [cslb.ca.gov](https://www.cslb.ca.gov) 为准。
