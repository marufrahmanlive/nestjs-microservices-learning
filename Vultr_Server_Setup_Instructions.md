1. create a custom named SSH Key
   ssh-keygen -t ed25519 -C "<email>"
   provide custom file name:
   Enter file in which to save the key (C:\Users\maruf/.ssh/id_ed25519): C:\Users\maruf/.ssh/id_vultr_ed25519
   passphase password: 123456

2. Display the public SSH key
   type $env:USERPROFILE\.ssh\id_vultr_ed25519.pub

3. Connect to the server with custom private ssh key
   if custom named private ssh key is created then need the below command:

```
ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 root@139.84.167.97
```

```
ssh root@139.84.167.97
```

ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 deploy@139.84.167.97

if ssh private key is added to ssh agent then password and passphase is never asked:
For windows:

```
Set-Service -Name ssh-agent -StartupType Manual
Start-Service ssh-agent
ssh-add C:\Users\maruf\.ssh\id_vultr_ed25519
``


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
#deploy user password is "*******"

9. After creating the deploy user from root then login to server as deploy user from another terminal

Copy the public key to your VPS using git bash
ssh-copy-id deploy@your-server-ip
login with the private key file path:
ssh -i $env:USERPROFILE\.ssh\id_vultr_ed25519 deploy@139.84.167.97
if ssh private key is added to ssh agent then loggedin automatically:
ssh deploy@139.84.167.97


9. Create GIT_PAT variable for cloning rivate repo in server

10. if ssh is created with passphrase then create a varibale in git with VPS_SSH_PASSPHRASE

11. Generate a new SSH key on the vps server using deploy user
ssh-keygen -t ed25519 -C "deploy@server"
cat ~/.ssh/id_ed25519.pub
Add the public key to GitHub Settings-> Deploy Keys -> Add Deploy Key
Tell the server to trust GitHub
ssh-keyscan github.com >> ~/.ssh/known_hosts
Verify
cat ~/.ssh/known_hosts
Test the connection
ssh -T git@github.com



12. Setting Up Nginx Reverse Proxy
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
For nginx if default file exists inside nginx then remove it by the following commands
ls -l /etc/nginx/sites-enabled/
```

sudo unlink /etc/nginx/sites-enabled/default
or
sudo rm /etc/nginx/sites-enabled/default

```
sudo nginx -t
sudo systemctl restart nginx


13.Run github Workflow then nestjs-app folder will be created inside /home/deploy/ folder
# Create environment file
sudo nano /home/deploy/nestjs-app/.env.production
PORT=3000
MONGODB_URI=mongodb+srv://root:<password>@<server>/books-db?appName=Cluster0&retryWrites=true&w=majority
NODE_ENV=production

14. Before testing http://139.84.166.59/health url, please configure the below commands
Security Hardening
Firewall Configuration:
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status


15. Add A record and CName record in namecheap:

Type:    A Record
Host:    api
Value:   139.84.166.59
TTL:     Automatic
============================================
Type:  CNAME
Host:  www.api
Value: api.marufrahman.live


16. SSL Certificate with Let's Encrypt
Install Certbot and get SSL certificate:
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.marufrahman.live -d www.api.marufrahman.live


17. Test the below urls after ssl certificate config
https://api.marufrahman.live/health
https://www.api.marufrahman.live/health


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
