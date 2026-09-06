# Kịch bản clip sale 5 phút — dựng theo khung GenSpark/GenOffice

> **Đã dựng xong.** Kịch bản này chạy được tại `/promo`, xem `PROMO.md` để biết
> cách quay. Bản dựng dài **4:38** thay vì 5:00, và có ba chỗ lệch so với bảng
> dưới đây, đều là cố ý:
>
> - Khối 5 gộp cảnh "tool call gọn" vào luôn cảnh so sánh, vì hai cảnh nói cùng
>   một điều và đặt cạnh nhau thì thừa.
> - Cảnh so sánh **không hiện số token**. Con số thật phụ thuộc vào bảng, nên bịa
>   một con số cho đẹp là nói dối; khối lượng chữ tràn màn hình đã đủ thấy.
> - Cảnh git cho thấy **chính cú undo là một commit**, thay vì commit sửa giá.
>   Cảnh trước vừa undo về 22.50 mà git lại khoe 22.50→24.00 thì gãy mạch — và
>   "undo cũng nằm trong lịch sử" là luận điểm mạnh hơn.

## Phần 1 — Phân tích clip tham chiếu

`GenOffice`, 87 giây, 1920×1080, 30fps, **câm hoàn toàn** — không lời đọc, không
nhạc dẫn chuyện. Toàn bộ gánh nặng dồn vào thẻ chữ và bản quay màn hình thật.

| mốc | trên hình |
|---|---|
| 0–4s | Thẻ tuyên bố: "World's First Full-Featured / Open-Source AI Office for PC and Mac" — chữ đen, nền gradient pastel, giữa khung, **chưa thấy sản phẩm** |
| 5s | Thẻ logo: mark + wordmark, cùng nền gradient |
| 9s | Một cảnh tổng quan: màn hình chính thật, "Good afternoon. What are you working on?", ô tạo mới + danh sách file gần đây |
| 12s | **Thẻ chương**: "Docs in GenOffice" — chữ đen trên nền trắng, không hình |
| 16s | Gõ prompt thật: "Create a professional resume for a Stanford CS master's graduate." |
| 20s | Kết quả: tài liệu hoàn chỉnh + panel AI giải thích bên phải |
| 23–34s | **Chỉnh tay**: đổi cỡ chữ, đổi heading, sửa "Summary" → "Highlights", in nghiêng, canh đều |
| 38s | Thẻ chương: "Sheets in GenOffice" |
| 45s | Prompt: "What was the subcategory sales share by quarter from 2025Q1 to 2026Q1?" |
| 48–56s | Bảng pivot + công thức, panel AI liệt kê các bước, nút **Undo**, nút **Stop** khi đang chạy |
| 59s | Thẻ chương: "Slides in GenOffice" |
| 66s | Prompt: "Polish and restructure this slide, keeping the theme colors." |
| 74s | Thẻ chương: "PDFs in GenOffice" |
| 81s | Prompt: "Highlight what's worth reading closely in this paper." |
| 84s | Thẻ đóng: logo + "Ad-free. Free for everyone." |

### Sáu quy tắc rút ra

1. **Tuyên bố trước, sản phẩm sau.** Bốn giây đầu không có UI, chỉ một câu định vị.
2. **Cấu trúc mô-đun, lặp y hệt.** Mỗi năng lực = một khối: thẻ chương → UI thật →
   gõ prompt → kết quả → một nhịp thao tác tay. Lặp bốn lần không đổi công thức.
3. **Thẻ chương cực rẻ mà cực hiệu quả.** Chữ đen, nền trắng, giữa khung. Nó cắt
   nhịp, cho người xem thở, và biến một clip dài thành bốn clip ngắn.
4. **Prompt phải đọc được và khác nhau.** Mỗi prompt khoe một loại năng lực khác:
   tạo mới, phân tích, sửa lại, đọc hiểu. Không lặp dạng câu.
5. **Luôn chèn một nhịp "người vẫn cầm lái".** Chỉnh cỡ chữ tay, nút Undo, nút Stop.
   Đây là chỗ chống lại nỗi sợ "AI làm bừa" — và là chỗ Mochi mạnh hơn họ.
6. **Kết bằng điều kiện tiếp cận, không phải tính năng.** "Ad-free. Free for everyone."

---

## Phần 2 — Kịch bản Mochi, 5 phút (300 giây)

Cùng khung, giãn ra năm khối. Chữ trên hình bằng tiếng Anh; chỉ dẫn quay bằng
tiếng Việt. Clip **câm**, thẻ chữ gánh nội dung — nếu thêm giọng đọc thì dùng cột
cuối.

Mọi con số dưới đây là số đo thật trong repo (10.000 dòng × 6 cột trên MacBook).
Không có con số nào bịa cho quảng cáo.

### Mở màn — 0:00 → 0:22

| mốc | trên hình | ghi chú quay |
|---|---|---|
| 0:00–0:06 | Thẻ tuyên bố, chữ đen nền giấy: **"Your team's data, in a file your AI can actually work in."** | giữ đúng 6s, không hiệu ứng |
| 0:06–0:11 | Thẻ logo: mark Mochi + "Mochi" | nền giấy `#f6f6f6` |
| 0:11–0:22 | Cảnh tổng quan: workspace thật, bảng Products đầy dữ liệu, Claude neo góc dưới trái, Mac dock dưới cùng | `/promo?t=20&paused=1` rồi cho chạy tiếp |

### Khối 1 — Tables · 0:22 → 1:12

| mốc | trên hình | lời đọc (nếu có) |
|---|---|---|
| 0:22–0:27 | Thẻ chương: **"Tables"** | — |
| 0:27–0:34 | Workspace rỗng, empty state "No collections yet" | Bắt đầu từ một file trống. |
| 0:34–0:42 | Gõ: *"Set up a CRM for our store and fill in the product catalogue."* | Hỏi như hỏi một đồng nghiệp. |
| 0:42–0:52 | `mochi.create_collections` chạy → 8 collection hiện ra → 12 dòng đổ vào theo nhóm | Nó ghi thẳng vào bảng của bạn. |
| 0:52–1:04 | **Nhịp cầm lái**: click vào một ô, sửa giá bằng tay, Enter | Không phải cửa sổ chat để bạn copy ra. |
| 1:04–1:12 | Kéo đổi thứ tự cột, đổi bộ lọc | Vẫn là bảng của bạn, không phải bản in ra. |

### Khối 2 — Agents · 1:12 → 2:04

| mốc | trên hình | lời đọc |
|---|---|---|
| 1:12–1:17 | Thẻ chương: **"Any agent, same file"** | — |
| 1:17–1:26 | Gõ: *"Generate a cover image for every product."* → `mochi.generate_covers` | — |
| 1:26–1:38 | Cột ảnh bìa lấp đầy từ trên xuống | Một câu, một cột, mười hai dòng. |
| 1:38–1:50 | **Bấm vào Codex trên Mac dock** → panel đổi từ Claude sang Codex, cùng bảng đó | Claude, Codex, hay OpenCode. Cùng một file. |
| 1:50–2:04 | Codex gõ tiếp: *"Filter to items under 10 in stock."* → bảng lọc lại | Qua MCP, chạy ngay trên máy bạn. |

### Khối 3 — History · 2:04 → 2:56

| mốc | trên hình | lời đọc |
|---|---|---|
| 2:04–2:09 | Thẻ chương: **"Nothing happens anonymously"** | — |
| 2:09–2:24 | Mở panel History của một dòng: `claude-code · Status Contacted → Qualified` | Mỗi thay đổi đều ký tên ai đã làm. |
| 2:24–2:38 | **Nhịp cầm lái**: bấm Undo — ô quay về giá trị cũ; bấm Redo | Và mỗi thay đổi đều quay lại được. |
| 2:38–2:56 | Chuyển sang cảnh git: lịch sử commit của workspace, diff từng dòng | Vì bên dưới nó là git. Lịch sử là của bạn, không phải của chúng tôi. |

### Khối 4 — Speed · 2:56 → 3:44

| mốc | trên hình | lời đọc |
|---|---|---|
| 2:56–3:01 | Thẻ chương: **"Small enough to forget it's running"** | — |
| 3:01–3:12 | Bốn con số hiện lần lượt: **0.3 s** · **1 ms** · **14 ms** · **0** | Đo trên bảng mười nghìn dòng. |
| 3:12–3:24 | Quay thật: đóng app, mở lại, bấm giờ — bảng hiện gần như tức thì | Mở nhanh hơn bạn kịp với tay tới. |
| 3:24–3:34 | Gõ vào ô, ký tự hiện theo đúng tốc độ gõ | Sửa một ô mất một mili giây. |
| 3:34–3:44 | Tìm kiếm toàn văn 10.000 dòng, kết quả ra ngay | Tìm trong mười nghìn dòng: một mili giây. |

### Khối 5 — Token & anti-slop · 3:44 → 4:32

| mốc | trên hình | lời đọc |
|---|---|---|
| 3:44–3:49 | Thẻ chương: **"It stops paying to look around"** | — |
| 3:49–4:04 | Chia đôi màn hình: bên trái agent kéo cả bảng vào hội thoại (chữ tràn), bên phải `summarise_table` trả về vài dòng | Agent xin đúng dòng và cột nó cần. |
| 4:04–4:16 | Panel Claude hiện tool call gọn: tên tool + thời gian, không có văn tả dài dòng | Rồi nhận lại bản tóm tắt. |
| 4:16–4:32 | Thẻ chữ lần lượt gạch ngang: No telemetry · No auto-update · No plugin store · No account to open a file | Hỏi bảng lớn tốn xấp xỉ hỏi bảng nhỏ. |

### Đóng — 4:32 → 5:00

| mốc | trên hình | lời đọc |
|---|---|---|
| 4:32–4:44 | Thẻ giá: **Free** cho một người — mọi thứ trong clip này chạy được mà không trả đồng nào. **Pro** khi có người khác cùng vào. | — |
| 4:44–4:54 | Mark Mochi lớn + "Mochi" + "One place for all your team's work." | Mochi. |
| 4:54–5:00 | `mochi-cli.com` | Một chỗ cho mọi việc của cả nhóm. |

---

## Phần 3 — Bản 90 giây cắt từ chính kịch bản này

Cấu trúc mô-đun nên cắt rất gọn. Giữ nguyên mở màn (rút còn 12s), lấy **khối 1**,
**khối 3** và **khối 4**, bỏ khối 2 và 5, giữ nguyên phần đóng:

`0:00 mở màn (12s) → Tables (25s) → History (20s) → Speed (18s) → đóng (15s)` = **90s**

Đây đúng là độ dài clip GenOffice, và giữ được ba lập luận mạnh nhất: nó tự dựng
bảng, mọi thứ quay lại được, và nó nhanh.

## Ghi chú dựng hình

- Thẻ chương: chữ đen `#0a0a0a` trên nền giấy `#f6f6f6`, canh giữa, ~64px, không
  hiệu ứng vào ra ngoài fade 200ms. Giữ 5 giây — đừng ngắn hơn.
- Mọi cảnh sản phẩm quay ở 1920×1080, con trỏ chuột **để hiện**, di chuyển chậm.
- Đừng cắt nhanh trong một khối. GenOffice giữ mỗi cảnh 3–5 giây; nhịp chậm làm
  sản phẩm trông chắc chắn, cắt nhanh làm nó trông như đang giấu gì đó.
- Mỗi khối phải có đúng một nhịp người thao tác tay. Đó là điều duy nhất phân biệt
  clip demo sản phẩm với clip quảng cáo AI.
