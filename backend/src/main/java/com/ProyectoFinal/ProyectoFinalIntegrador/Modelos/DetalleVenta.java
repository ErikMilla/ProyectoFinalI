package com.ProyectoFinal.ProyectoFinalIntegrador.Modelos;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "DetalleVenta")
public class DetalleVenta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_detalle;

    @ManyToOne
    @JoinColumn(name = "id_venta")
    @JsonIgnore
    private Venta venta;

    @Column(name = "id_producto")
    private int id_producto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto", insertable = false, updatable = false)
    private Producto producto;

    private int cantidad;

    // Getters y Setters
    public int getId_detalle() {
        return id_detalle;
    }
    public void setId_detalle(int id_detalle) {
        this.id_detalle = id_detalle;
    }
    public Venta getVenta() {
        return venta;
    }
    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public int getId_producto() {
        return id_producto;
    }
    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public int getCantidad() {
        return cantidad;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
} 