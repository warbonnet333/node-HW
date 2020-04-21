# Получаем и выводим весь список контакстов в виде таблицы (console.table)
node index.js --action="list"

![Image of list action](https://ibb.co/mB26vWX)

# Получаем контакт по id
node index.js --action="get" --id=5

![Image of get action](https://ibb.co/FBLjPSW)

# Добавялем контакт
node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"

![Image of get action](https://ibb.co/yYcM4WM)

# Удаляем контакт
node index.js --action="remove" --id=3

![Image of get action](https://ibb.co/Qcpg7x2)
