# 📚 Books API

A simple **Books CRUD REST API** built with NestJS, designed for learning **manual deployment**, **CI/CD**, and **Docker deployment** on a Vultr VPS.

> ⚠️ Intentionally simple — focus is on deployment, not business logic.

---

## 🛠️ Tech Stack

| Layer               | Technology                          |
| ------------------- | ----------------------------------- |
| **Runtime**         | Node.js (LTS)                       |
| **Framework**       | NestJS 11                           |
| **Language**        | TypeScript                          |
| **Database**        | MongoDB Atlas (Free Tier)           |
| **ODM**             | Mongoose                            |
| **Validation**      | class-validator + class-transformer |
| **Logging**         | NestJS Built-in Logger + Winston    |
| **Process Manager** | PM2                                 |
| **Reverse Proxy**   | Nginx                               |
| **CI/CD**           | GitHub Actions                      |
| **Container**       | Docker + Docker Compose             |

---

## 📁 Project Structure

```
nestjs-app/
├── .env                              # Your secrets
├── .env.example                      # Safe template
├── .gitignore                        # Untracked files
├── ecosystem.config.js               # PM2 config
├── package.json                      # Dependencies
├── src/
│   ├── main.ts                       # Entry point
│   ├── app.module.ts                 # Root module
│   ├── common/
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts
│   │   └── interceptors/
│   │       └── logging.interceptor.ts
│   ├── books/
│   │   ├── dto/
│   │   │   ├── create-book.dto.ts
│   │   │   └── update-book.dto.ts
│   │   ├── schemas/
│   │   │   └── book.schema.ts
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   ├── books.module.ts
│   │   └── books.controller.spec.ts
│   └── health/
│       ├── health.controller.ts
│       └── health.module.ts
└── test/
```

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later**
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://cloud.mongodb.com) **free account**

---

## 🗄️ MongoDB Atlas Setup (Free Tier)

### Step 1: Create an Account

Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up.

### Step 2: Create a Free Cluster

1. Click **"Create a Cluster"** → Choose **M0** (FREE tier)
2. Pick a cloud provider & region → Click **"Create Cluster"** (~2 min)

### Step 3: Create a Database User

1. **"Database Access"** → **"Add New Database User"**
2. Username: `books-admin` | Password: **save it!**
3. Privileges: **"Read and write to any database"**

### Step 4: Network Access

1. **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (for learning)

### Step 5: Connection String

1. **"Database"** → **"Connect"** → **"Drivers"**
2. Copy string, add `/books-db` before `?`:

```
mongodb+srv://books-admin:<password>@cluster0.xxxxx.mongodb.net/books-db?retryWrites=true&w=majority
```

---

## ⚙️ Environment Variables

```bash
cp .env.example .env
```

Your `.env`:

````env
PORT=3000
MONGODB_URI=mongodb+srv://books-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/books-db?retryWrites=true&w=majority

---

## 🚀 Local Setup

```bash
cd nestjs-app
npm install
npm run build
npm test              # No MongoDB needed!
npm run start:dev     # Needs MongoDB URI in .env
````

Expected startup log:

```
[Nest] LOG [Bootstrap] 🚀 Application is running on: http://localhost:3000
```

---

## 🌐 API Endpoints

| Method   | URL          | Description                 |
| -------- | ------------ | --------------------------- |
| `GET`    | `/health`    | Health check (no DB needed) |
| `GET`    | `/books`     | Get all books               |
| `GET`    | `/books/:id` | Get one book                |
| `POST`   | `/books`     | Create a book               |
| `PATCH`  | `/books/:id` | Update a book               |
| `DELETE` | `/books/:id` | Delete a book               |

### Book Schema

```json
{
  "title": "string (required, max 200)",
  "author": "string (required, max 100)",
  "year": "number (required, min 1000, max current year)",
  "description": "string (optional, max 2000)"
}
```

---

## 🧪 Complete Testing Flow

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**→ 200:** `{ "status": "ok", "uptime": 12.3, "message": "Books API is running! 🚀" }`

### 2. Create Sample Books

```bash
# Book 1
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","year":1925,"description":"A story of Jay Gatsby and his love for Daisy Buchanan."}'

# Book 2
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"Dune","author":"Frank Herbert","year":1965,"description":"Set on the desert planet Arrakis."}'

# Book 3
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","year":1949,"description":"A dystopian novel about totalitarianism."}'
```

**→ 201:** `{ "_id": "...", "title": "The Great Gatsby", "createdAt": "...", ... }`

### 3. Get All Books

````bash
curl http://localhost:3000/books

---

### 7. Test Validation Errors

**❌ Missing required fields:**
```bash
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"Missing Author"}'
````

**→ 400:** `["author must be a string", "author should not be empty", "year must be a number ..."]`

**❌ Invalid year:**

```bash
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"Ancient","author":"Unknown","year":500}'
```

**→ 400:** `["year must not be less than 1000"]`

**❌ Extra fields blocked by whitelist:**

```bash
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" \
  -d '{"title":"Hacked","author":"Hacker","year":2024,"isAdmin":true,"password":"secret"}'
```

**→ 400:** `["property isAdmin should not exist", "property password should not exist"]`

**❌ Book not found:**

```bash
curl http://localhost:3000/books/507f1f77bcf86cd799439011
```

**→ 404:** `{ "statusCode": 404, "message": "Book with ID ... not found" }`

---

### 📊 All Test Cases Summary

| #   | Endpoint            | Action         | HTTP | Response           |
| --- | ------------------- | -------------- | ---- | ------------------ |
| 1   | `GET /health`       | Health check   | 200  | `{ status: "ok" }` |
| 2   | `POST /books`       | Create book    | 201  | Book with `_id`    |
| 3   | `GET /books`        | Get all        | 200  | Array of books     |
| 4   | `GET /books/:id`    | Get one        | 200  | Single book        |
| 5   | `PATCH /books/:id`  | Update         | 200  | Updated book       |
| 6   | `DELETE /books/:id` | Delete         | 200  | Success message    |
| 7   | `POST /books` (bad) | Missing fields | 400  | Validation errors  |
| 8   | `POST /books` (bad) | Invalid year   | 400  | Min/max errors     |
| 9   | `POST /books` (bad) | Extra fields   | 400  | Whitelist errors   |
| 10  | `GET /books/fakeid` | Not found      | 404  | Not found message  |

---

## 🧪 Unit Tests

```bash
npm test              # 6 tests, no MongoDB needed!
npm run test:watch    # Re-runs on file changes
npm run test:cov      # With coverage report
```

Expected output:

```
 PASS  src/books/books.controller.spec.ts
  BooksController
    ✓ should be defined
    findAll
      ✓ should return an array of books
    findOne
      ✓ should return a single book
    create
      ✓ should create a book
    update
      ✓ should update a book
    remove
      ✓ should delete a book

Tests: 6 passed, 6 total
```

---

## 📜 Available Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run build`      | Compile TypeScript       |
| `npm run start:dev`  | Dev mode with hot-reload |
| `npm run start:prod` | Run compiled JS          |
| `npm test`           | Unit tests               |
| `npm run lint`       | ESLint check             |
| `npm run format`     | Prettier format          |

---

## 🚢 Deployment

| Phase       | Method | Tools                          |
| ----------- | ------ | ------------------------------ |
| **Phase 1** | Manual | PM2 + Nginx on Vultr VPS       |
| **Phase 2** | CI/CD  | GitHub Actions → VPS           |
| **Phase 3** | Docker | Docker + GHCR + GitHub Actions |

### PM2 Quick Reference

```bash
pm2 start ecosystem.config.js  # Start
pm2 status                     # Status
pm2 logs nestjs-app             # Logs
pm2 restart nestjs-app          # Restart
pm2 save && pm2 startup        # Survive reboot
```

---

## 🛡️ Security

| Feature                 | Purpose                   |
| ----------------------- | ------------------------- |
| `whitelist: true`       | Strips unknown properties |
| `forbidNonWhitelisted`  | Rejects extra fields      |
| Global Exception Filter | Hides stack traces        |
| `.env` + `.gitignore`   | Secrets stay local        |
| CORS                    | Controls domain access    |

---

## 📄 License

MIT — free to use for learning!

````
**→ 200:** Array of 3 books

### 4. Get One Book
```bash
curl http://localhost:3000/books/{ID}    # Replace {ID} with actual _id
````

**→ 200:** Single book object

### 5. Update a Book

```bash
curl -X PATCH http://localhost:3000/books/{ID} -H "Content-Type: application/json" \
  -d '{"description":"Updated description"}'
```

**→ 200:** Updated book with new `updatedAt`

### 6. Delete a Book

```bash
curl -X DELETE http://localhost:3000/books/{ID}
```

**→ 200:** `{ "message": "Book deleted successfully" }`
NODE_ENV=development

```

> ⚠️ NEVER commit `.env` — already in `.gitignore`!
```

# All Instructions

```
1. create a custom named SSH Key
ssh-keygen -t ed25519 -C "marufrahmanbd08@gmail.com"
provide custom file name:
Enter file in which to save the key (C:\Users\maruf/.ssh/id_ed25519): C:\Users\maruf/.ssh/id_vultr_ed25519
passphase password: 123456

2. Display the public SSH key
type $env:USERPROFILE\.ssh\id_vultr_ed25519.pub

3. Connect to the server with custom private ssh key
ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 root@139.84.172.55
ssh root@139.84.172.55
ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 deploy@139.84.172.55


provide passphase password: 123456

4. Update and Upgrade APT Registry
apt update && apt upgrade -y

5. Install nodejs 24 version on server
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
apt-get install -y nodejs
node -v

6. Install pm2 globally
npm install -g pm2

7. Install Nginx
apt install nginx -y
systemctl start nginx
systemctl enable nginx

8. Create a non-root user:
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
#deploy user password is "a684008z"

9. After creating the deploy user from root then login to server as deploy user from another terminal
ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 deploy@139.84.172.55
ssh deploy@139.84.172.55


9. CreateGIT_PAT variable for cloning rivate repo in server

10. if ssh is created with passphrase then create a varibale in git with VPS_SSH_PASSPHRASE

11. Generate a new SSH key in server
ssh-keygen -t ed25519 -C "deploy@server"
cat ~/.ssh/id_ed25519.pub
Add the public key to GitHub
Settings-Deploy Keys-Add Deploy Key
Tell the server to trust GitHub
ssh-keyscan github.com >> ~/.ssh/known_hosts
Verify
cat ~/.ssh/known_hosts
Test the connection
ssh -T git@github.com

12.
# Create environment file
sudo nano /home/deploy/nestjs-app/.env.production
PORT=3000
MONGODB_URI=mongodb+srv://root:a684008z@cluster0.hde6dpq.mongodb.net/books-db?appName=Cluster0&retryWrites=true&w=majority
NODE_ENV=production



11. Setting Up Nginx Reverse Proxy
sudo nano /etc/nginx/sites-available/nestjs-app
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
sudo ln -s /etc/nginx/sites-available/nestjs-app /etc/nginx/sites-enabled/
ls -l /etc/nginx/sites-enabled/
```

sudo unlink /etc/nginx/sites-enabled/default
or
sudo rm /etc/nginx/sites-enabled/default

```
sudo nginx -t
sudo systemctl restart nginx



11.
For nginx if default file exists inside nginx then remove it by the following commands
ls -la /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx


12. To See pm2 instances count to reflect in the system then run the below:
pm2 delete nestjs-app
pm2 start ecosystem.config.js --env production

13. Increase instances later from server shell
pm2 scale nestjs-app 4

```

# Reference Website

```
https://huyha.zone/blog/post/deploy-nestjs-to-vultr-vps-github-actions/
```
