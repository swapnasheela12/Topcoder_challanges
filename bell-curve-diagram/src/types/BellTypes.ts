// export interface LinkItem {
//   text: string;
//   desc: string;
//   url: string;
// }

// export interface Item {
//   title: string;
//   toolTipTitle: string;
//   toolTipText: string;
//   links: LinkItem[];
// }

// export interface Category {
//   icon: string;
//   color: string;
//   textColor: string;
//   items: Item[];
// }

// export interface BellData {
//   [category: string]: Category;
// }


export interface Item {
  title: string;
  toolTipTitle: string;
  toolTipText: string;
}

export interface Category {
  icon: string;
  color: string;
  textColor: string;
  items: Item[];
}

export interface BellData {
  [category: string]: Category;
}
