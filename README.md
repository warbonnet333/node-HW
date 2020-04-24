# Получаем и выводим весь список контакстов в виде таблицы (console.table)
node index.js --action="list"

![Image of list action](https://img.techpowerup.org/200421/action-list.jpg)

# Получаем контакт по id
node index.js --action="get" --id=5

![Image of get action](https://img.techpowerup.org/200421/action-get.jpg)

# Добавялем контакт
node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"

![Image of add action](https://img.techpowerup.org/200421/action-add.jpg)

# Удаляем контакт
node index.js --action="remove" --id=3

![Image of remove action](https://img.techpowerup.org/200421/action-remove.jpg)
