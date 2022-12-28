export class Photo {
  id!: string;
  owner!: string;
  description!: any;
  secret!: string;
  server!: string;
  iconserver ?: number;
  farm!: number;
  iconfarm ?: number;
  title!: string;
  ispublic!: number;
  isfriend!: number;
  isfamily!: number;
  smallImageUrl!: string;
  largeImageUrl!: string;
  photosFromSameOwner?: Photos;
  datetaken!: Date;
  ownername !: string;
  tags !: string;
  geo: any;

  constructor(obj2clone?: Photo, modifierObj?: {}) {
    if (obj2clone) {
      Object.assign(this, obj2clone);
    }
    if (modifierObj) {
      Object.assign(this, modifierObj);
    }
  }
}

export class Photos {
  page!: number;
  pages!: number;
  perpage!: number;
  total!: number;
  photo!: Photo[];
  constructor(obj2clone?: Photos, modifierObj?: {}) {
    if (obj2clone) {
      Object.assign(this, obj2clone);
      this.photo.forEach((e) => {
        e.smallImageUrl = `//live.staticflickr.com/${e.server}/${e.id}_${e.secret}_n.jpg`;
        e.largeImageUrl = `//live.staticflickr.com/${e.server}/${e.id}_${e.secret}_b.jpg`;
      });
    }
    if (modifierObj) {
      Object.assign(this, modifierObj);
    }
  }
}

export class PhotosRootModel {
  photos!: Photos;
  stat!: string;
  constructor(obj2clone?: PhotosRootModel, modifierObj?: {}) {
    if (obj2clone) {
      Object.assign(this, obj2clone);
    }
    if (modifierObj) {
      Object.assign(this, modifierObj);
    }
  }
}

export class SearchFilterModel {
  searchInText!: boolean;
  contentType!: string;
  fromDate!: Date;
  toDate!: Date;
  colorCode!: string;
  safe_search !: number;
  constructor(obj2clone?: SearchFilterModel, modifierObj?: {}) {
    if (obj2clone) {
      Object.assign(this, obj2clone);
    }
    if (modifierObj) {
      Object.assign(this, modifierObj);
    }
  }
}
