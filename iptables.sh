sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 4200
sudo iptables -A PREROUTING -t nat -p tcp --dport 443 -j REDIRECT --to-ports 4443
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 4200
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 443 -j REDIRECT --to-port 4443

