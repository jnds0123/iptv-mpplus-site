import markdown, io, sys, html

CSS = """
@page { size: A4; margin: 20mm 18mm 18mm; }
body { font-family: "Calibri","Segoe UI",system-ui,sans-serif; font-size: 10.5pt; line-height: 1.55;
       color: #14192B; margin:0; }
h1 { font-family: Cambria, Georgia, serif; font-size: 24pt; font-weight: 700; color:#0B1220;
     letter-spacing:-.01em; margin: 0 0 4pt; }
h2 { font-family: Cambria, Georgia, serif; font-size: 15pt; font-weight:700; color:#0B1220;
     margin: 22pt 0 6pt; padding-top: 6pt; border-top: 1px solid #E2E7EF; }
h3 { font-size: 11.5pt; font-weight:700; color:#0B1220; margin: 14pt 0 4pt; }
h4 { font-size: 10.5pt; font-weight:700; color:#5A6880; margin: 12pt 0 3pt; }
p, li { color:#333B4D; }
a { color:#8A6A14; text-decoration:none; }
code { font-family:"Consolas","Courier New",monospace; font-size:9pt; background:#F3F5F9;
       padding:1px 4px; border-radius:3px; color:#0B1220; }
pre { background:#0B1220; color:#E7EBF2; padding:11pt 13pt; border-radius:5pt; overflow-x:auto;
      font-family:"Consolas","Courier New",monospace; font-size:7.4pt; line-height:1.42; }
pre code { background:none; color:inherit; padding:0; font-size:inherit; }
table { border-collapse:collapse; width:100%; margin:9pt 0; font-size:9.2pt; }
th { text-align:left; background:#F3F5F9; border-bottom:1.5px solid #C9D1DE; padding:5pt 7pt;
     font-size:8.2pt; text-transform:uppercase; letter-spacing:.06em; color:#5A6880; }
td { border-bottom:1px solid #E6EAF1; padding:5pt 7pt; vertical-align:top; }
blockquote { border-left:3px solid #C8A24A; background:#FBF7EC; margin:10pt 0; padding:8pt 12pt;
             color:#4A5568; }
blockquote p { margin:0; }
ul, ol { padding-left: 16pt; }
li { margin: 2pt 0; }
hr { border:none; border-top:1px solid #E2E7EF; margin:16pt 0; }
strong { color:#0B1220; }
h2, h3, table, pre { break-inside: avoid; }
h1, h2, h3 { break-after: avoid; }
"""

src, out, title = sys.argv[1], sys.argv[2], sys.argv[3]
md = io.open(src, encoding="utf-8").read()
body = markdown.markdown(md, extensions=["tables", "fenced_code", "toc", "sane_lists"])
doc = ("<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + html.escape(title) +
       "</title><style>" + CSS + "</style></head><body>" + body + "</body></html>")
io.open(out, "w", encoding="utf-8").write(doc)
print("wrote", out)
