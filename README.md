
# 🖋️ InDesign Project Translator API

A Node.js API to **automatically translate IDML files** using Azure Translator.

## 🚀 How to run the project

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file at the root of the project with the following content:

```plaintext
AZURE_TRANSLATOR_KEY=your-azure-key
AZURE_TRANSLATOR_REGION=your-azure-region
PORT=3000
```

### 4️⃣ Start the server

```bash
node server.js
```

The server will start on the port defined in the `.env` file or, by default, on **3000**.

---

## 📤 How to use the API

**Endpoint:** `POST /upload`

**Expected parameters (form-data):**

- **file**: The IDML file to be translated.
- **language**: (optional) Target language (e.g., `pt` for Portuguese).

### Example using cURL:

```bash
curl -F "file=@yourfile.idml" -F "language=pt" http://localhost:3000/upload
```

**Expected response:**

```json
{
  "status": "ok",
  "filename": "translated-file-name.idml"
}
```

---

## 🏗️ DDD / Clean Architecture Structure

| Layer          | Folder            | Responsibility                                   |
|----------------|------------------|-------------------------------------------------|
| Configuration  | `config/`        | Logger and environment variables                |
| Domain         | `domain/`        | Business rules (translation, IDML processing)   |
| Infrastructure | `infrastructure/`| External services (Azure Translator, file handling) |
| Interfaces     | `interfaces/`    | HTTP controllers                                |
| Routes         | `routes/`        | Express route definitions                       |
| Shared         | `shared/`        | Utilities (e.g., Multer configuration)          |
| Uploads        | `uploads/`       | Directory for temporary uploaded files          |

---

## 📝 License

ISC License
