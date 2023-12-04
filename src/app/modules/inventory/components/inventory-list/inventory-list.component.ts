import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../app.value';
import { Table } from 'primeng/table';
import { forEach } from 'lodash-es';

@Component({
  selector: 'app-root',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class InventoryListComponent implements OnInit {
  @ViewChild('dt') table?: Table;

  productDialog = false;
  products: Product[] = [];
  product: Product = { name: '' };
  selectedProducts: Product[] = [];
  submitted = false;
  category1List: string[] = [];
  location1List: string[] = [];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    this.category1List = ['육아용품', '산모용품'];
    this.location1List = ['거실', '부엌', '안방', '컴퓨터방'];
  }

  openNew() {
    this.product = { name: '' };
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });

        forEach(this.selectedProducts, ({ id }) => {
          if (id) {
            this.productService.deleteProduct(id);
          }
        });
        this.selectedProducts = [];
      },
    });
  }

  searchProducts(event: Event): void {
    this.table?.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = { name: '' };
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });

        if (product.id) {
          this.productService.deleteProduct(product.id);
        }
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
        this.productService.updateProduct(this.product.id, this.product);
      } else {
        this.product.id = this.createId();
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
        this.productService.addProduct(this.product);
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = { name: '' };
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
