import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CarritoContext = createContext(null);

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [total, setTotal] = useState(0);
    const [showMiniCarrito, setShowMiniCarrito] = useState(false);
    const [loadingCarrito, setLoadingCarrito] = useState(false);

    const BACKEND_PORT = 8081; // Asegúrate de que este puerto sea correcto

    // Efecto para calcular el total cuando cambian los detalles del carrito
    useEffect(() => {
        const calculatedTotal = detalles.reduce((sum, item) => {
            // Asegurarse de que item.producto y item.producto.precio existan y sean números
            const precio = item.producto && item.producto.precio ? parseFloat(item.producto.precio) : 0;
            return sum + (precio * item.cantidad);
        }, 0);
        setTotal(calculatedTotal);
    }, [detalles]); // Este efecto se ejecuta cada vez que 'detalles' cambia

    const fetchCarrito = useCallback(async (userId) => {
        if (!userId) return;
        setLoadingCarrito(true);
        try {
            const response = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/activo/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setCarrito(data);
                setDetalles(data.detalles || []);
            } else if (response.status === 404) {
                setCarrito(null);
                setDetalles([]);
                setTotal(0);
            } else {
                console.error('Error al obtener el carrito');
                setCarrito(null);
                setDetalles([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error de red al obtener el carrito:', error);
            setCarrito(null);
            setDetalles([]);
            setTotal(0);
        } finally {
            setLoadingCarrito(false);
        }
    }, []);

    const toggleMiniCarrito = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        if (!idUsuario) {
             // Redirigir a login si no está logueado
             // Esto debería manejarse en Layout o donde se use el hook
             console.log('Usuario no logueado, redirigir a login');
        } else {
            setShowMiniCarrito(!showMiniCarrito);
            if (!showMiniCarrito) {
                 fetchCarrito(parseInt(idUsuario));
            }
        }
    };

    // Implementar las funciones de aumentar, disminuir, eliminar y finalizar compra aquí
    const handleAumentarCantidad = async (idDetalle, cantidadActual) => {
        const idUsuario = localStorage.getItem('idUsuario');
        if (!idUsuario) return; 
        try {
            const response = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/detalle/${idDetalle}/aumentar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: cantidadActual + 1 }),
            });
            if (response.ok) {
                fetchCarrito(parseInt(idUsuario)); // Recargar carrito después de actualizar
            } else {
                console.error('Error al aumentar cantidad');
            }
        } catch (error) {
            console.error('Error de red al aumentar cantidad:', error);
        }
    };

    const handleDisminuirCantidad = async (idDetalle, cantidadActual) => {
        const idUsuario = localStorage.getItem('idUsuario');
        if (!idUsuario) return; 
        if (cantidadActual <= 1) {
            // Si la cantidad es 1 o menos, eliminar el detalle
            await eliminarDetalle(idDetalle);
        } else {
            try {
                const response = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/detalle/${idDetalle}/disminuir`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cantidad: cantidadActual - 1 }),
                });
                if (response.ok) {
                     fetchCarrito(parseInt(idUsuario)); // Recargar carrito después de actualizar
                } else {
                     console.error('Error al disminuir cantidad');
                }
            } catch (error) {
                 console.error('Error de red al disminuir cantidad:', error);
            }
        }
    };

    const eliminarDetalle = async (idDetalle) => {
        const idUsuario = localStorage.getItem('idUsuario');
        if (!idUsuario) return; 
        try {
            const response = await fetch(`http://localhost:${BACKEND_PORT}/api/carrito/detalle/${idDetalle}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                 fetchCarrito(parseInt(idUsuario)); // Recargar carrito después de eliminar
            } else {
                 console.error('Error al eliminar detalle');
            }
        } catch (error) {
             console.error('Error de red al eliminar detalle:', error);
        }
    };

    const finalizarCompra = () => {
        // Lógica para finalizar compra (probablemente redirigir a otra página)
        // Esto también podría estar en el contexto si maneja el estado de la compra
        console.log('Finalizar compra');
        // Aquí podrías llamar a un endpoint del backend para finalizar la venta
    };

    return (
        <CarritoContext.Provider value={{ 
            carrito, 
            detalles,
            total,
            showMiniCarrito,
            setShowMiniCarrito,
            loadingCarrito,
            fetchCarrito, 
            toggleMiniCarrito,
            handleAumentarCantidad, // Exponer la función
            handleDisminuirCantidad, // Exponer la función
            eliminarDetalle, // Exponer la función
            finalizarCompra // Exponer la función
            }}>
            {children}
        </CarritoContext.Provider>
    );
}; 