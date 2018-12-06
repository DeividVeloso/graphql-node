FROM mysql:5.7
ENV MYSQL_DATABASE graphql-blog-development

#create image
# docker build -t graphql-curso .

# Create container
# docker run -d -p 3306:3306 --name graphql-curso-container \-e MYSQL_ROOT_PASSWORD=123456 graphql-curso

# enter inside container
# docker exec -it graphql-curso-container bash

#login mysql
# mysql -uroot -p
