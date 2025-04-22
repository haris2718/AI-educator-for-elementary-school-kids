# Βασική εικόνα του Nginx
FROM nginx:alpine

# Αντιγραφή του αρχείου nginx.conf στο container
COPY nginx.conf /etc/nginx/nginx.conf

# Αντιγραφή όλων των αρχείων από τον φάκελο dist στον κατάλογο του Nginx
COPY dist/ /usr/share/nginx/html/

RUN find /etc/nginx/ -type d -exec chmod 755 {} \; 
RUN find /usr/share/nginx/html -type f -exec chmod 644 {} \;

RUN find /usr/share/nginx/html/ -type d -exec chmod 755 {} \; 
RUN find /usr/share/nginx/html/assets -type f -exec chmod 644 {} \;

# Άνοιγμα της θύρας 3000 για τον Nginx
EXPOSE 3000

# Ο Nginx εκκινεί αυτόματα όταν το container τρέχει
CMD ["nginx", "-g", "daemon off;"]
