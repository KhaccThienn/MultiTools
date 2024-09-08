import React from 'react';
import '../css/app.css';

const ListMenu = ({ items }) => {
  return (
    <ul className="list-menu">
      {items.map((item, index) => (
        <li key={index}>
          <a href={item.item_link}>{item.item_name}</a>
        </li>
      ))}
    </ul>
  );
};

export default ListMenu;
