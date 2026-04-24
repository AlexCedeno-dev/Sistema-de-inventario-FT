import { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Package,
  Search,
  Plus,
  Upload,
  Repeat,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Settings,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ModalasOfABC } from '../components/inventoryABC/ModalasOfABC';

type Categoria = {
  categoria_id: number;
  nombre: string;
};

type InventarioABCItem = {
  inventario_abc_id: number;
  categoria_id: number;
  categoria: string;
  cantidad: number;
  cantidad_prestada?: number;
  nombre: string;
  marca: string | null;
  modelo: string | null;
  descripcion: string | null;
  estado_equipo: string | null;
  ticket_asignacion: string | null;
  solicitado_por: string | null;
  observaciones: string | null;
  imagen_principal?: string | null;
};

type ImagenABC = {
  imagen_id: number;
  inventario_abc_id: number;
  nombre_archivo: string;
  ruta_archivo: string;
};

type MovimientoPayload = {
  inventario_abc_id: number;
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  numero_ticket: string;
  solicitado_por: string;
  comentario: string;
};

type FormDataABC = {
  categoria_id: string;
  cantidad: string;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  estado_equipo: string;
  ticket_asignacion: string;
  solicitado_por: string;
  observaciones: string;
};

type ExcelPreviewRow = {
  categoria: string;
  cantidad: number;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  estado_equipo: string;
  ticket_asignacion: string;
  solicitado_por: string;
  observaciones: string;
};

type StockCategoria = {
  stock_categoria_id: number;
  categoria_id: number;
  categoria: string;
  stock_total: number;
  piezas_registradas: number;
  stock_disponible: number;
};

type PrestamoABC = {
  prestamo_id: number;
  inventario_abc_id: number;
  ticket_prestamo: string;
  solicitante_nombre: string;
  departamento: string;
  cantidad: number;
  estado_entrega: string;
  fecha_asignacion: string;
  estado_prestamo: 'prestado' | 'devuelto';
  estado_devolucion: string | null;
  detalle_devolucion: string | null;
  fecha_devolucion: string | null;
  comentario: string | null;
};

type FormPrestamoABC = {
  solicitante_nombre: string;
  departamento: string;
  cantidad: string;
  estado_entrega: string;
  fecha_asignacion: string;
  comentario: string;
};

type FormDevolucionABC = {
  prestamo_id: number;
  estado_devolucion: string;
  detalle_devolucion: string;
  fecha_devolucion: string;
};

const initialForm: FormDataABC = {
  categoria_id: '',
  cantidad: '',
  nombre: '',
  marca: '',
  modelo: '',
  descripcion: '',
  estado_equipo: '',
  ticket_asignacion: '',
  solicitado_por: '',
  observaciones: '',
};

const initialPrestamoForm: FormPrestamoABC = {
  solicitante_nombre: '',
  departamento: '',
  cantidad: '1',
  estado_entrega: 'Buen estado',
  fecha_asignacion: '',
  comentario: '',
};

const initialDevolucionForm: FormDevolucionABC = {
  prestamo_id: 0,
  estado_devolucion: 'Buen estado',
  detalle_devolucion: '',
  fecha_devolucion: '',
};

const initialMovimiento: MovimientoPayload = {
  inventario_abc_id: 0,
  tipo_movimiento: 'entrada',
  cantidad: 1,
  numero_ticket: '',
  solicitado_por: '',
  comentario: '',
};

const categoriasBase = [
  { nombre: 'Mouse' },
  { nombre: 'Cables' },
  { nombre: 'Impresoras' },
  { nombre: 'Teclados' },
  { nombre: 'Monitores' },
  { nombre: 'Otros' },
  { nombre: 'OLS' },
];

export function InventoryABC() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [items, setItems] = useState<InventarioABCItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMovimientoOpen, setIsMovimientoOpen] = useState(false);
  const [isImagenesOpen, setIsImagenesOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<InventarioABCItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventarioABCItem | null>(null);

  const [formData, setFormData] = useState<FormDataABC>(initialForm);
  const [movimientoData, setMovimientoData] =
    useState<MovimientoPayload>(initialMovimiento);

  const [imagenes, setImagenes] = useState<ImagenABC[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [newItemImages, setNewItemImages] = useState<FileList | null>(null);

  const [guardandoForm, setGuardandoForm] = useState(false);
  const [guardandoMovimiento, setGuardandoMovimiento] = useState(false);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);

  const [excelPreview, setExcelPreview] = useState<ExcelPreviewRow[]>([]);
  const [importandoExcel, setImportandoExcel] = useState(false);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [stocksCategoria, setStocksCategoria] = useState<StockCategoria[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [stockEditValue, setStockEditValue] = useState('');
  const [savingStock, setSavingStock] = useState(false);

  const [isPrestamoOpen, setIsPrestamoOpen] = useState(false);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [isDevolucionOpen, setIsDevolucionOpen] = useState(false);

  const [prestamoForm, setPrestamoForm] = 
    useState<FormPrestamoABC>(initialPrestamoForm);

  const [devolucionForm, setDevolucionForm] =
    useState<FormDevolucionABC>(initialDevolucionForm);

    const [prestamos, setPrestamos] = useState<PrestamoABC[]>([]);
    const [guardandoPrestamo, setGuardandoPrestamo] = useState(false);
    const [guardandoDevolucion, setGuardandoDevolucion] = useState(false);
    const [loadingPrestamos, setLoadingPrestamos] = useState(false);





  const importInputRef = useRef<HTMLInputElement | null>(null);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventario-abc/categorias`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    }
  };

  const fetchInventario = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/inventario-abc`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error cargando inventario ABC:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStocksCategoria = async () => {
    try {
      setLoadingStocks(true);

      const response = await fetch(`${API_BASE}/inventario-abc/stocks`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setStocksCategoria(data);
    } catch (error) {
      console.error('Error cargando stocks por categoría:', error);
      setStocksCategoria([]);
    } finally {
      setLoadingStocks(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchInventario();
    fetchStocksCategoria();
  }, []);

  const categoriasUI = useMemo(() => {
    if (categorias.length > 0) {
      return categorias.map((c) => c.nombre);
    }

    return categoriasBase.map((c) => c.nombre);
  }, [categorias]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = searchTerm.toLowerCase().trim();

      const matchesCategoria =
        selectedCategoria === 'Todas' ||
        (item.categoria ?? '').toLowerCase() === selectedCategoria.toLowerCase();

      const estadoActual = (item.estado_equipo ?? '').toLowerCase();
      const matchesEstado =
        selectedEstado === 'Todos' ||
        estadoActual.includes(selectedEstado.toLowerCase());

      const searchableText = `
        ${item.nombre ?? ''}
        ${item.marca ?? ''}
        ${item.modelo ?? ''}
        ${item.descripcion ?? ''}
        ${item.ticket_asignacion ?? ''}
        ${item.solicitado_por ?? ''}
        ${item.categoria ?? ''}
      `.toLowerCase();

      return matchesCategoria && matchesEstado && searchableText.includes(term);
    });
  }, [items, searchTerm, selectedCategoria, selectedEstado]);

  const stockSeleccionado = useMemo(() => {
    if (selectedCategoria === 'Todas') return null;

    return (
      stocksCategoria.find(
        (item) => item.categoria.toLowerCase() === selectedCategoria.toLowerCase()
      ) || null
    );
  }, [stocksCategoria, selectedCategoria]);

  const stockGeneral = useMemo(() => {
    const stockTotal = stocksCategoria.reduce(
      (acc, item) => acc + Number(item.stock_total || 0),
      0
    );

    const piezasRegistradas = stocksCategoria.reduce(
      (acc, item) => acc + Number(item.piezas_registradas || 0),
      0
    );

    const stockDisponible = stocksCategoria.reduce(
      (acc, item) => acc + Number(item.stock_disponible || 0),
      0
    );

    return {
      stock_total: stockTotal,
      piezas_registradas: piezasRegistradas,
      stock_disponible: stockDisponible,
    };
  }, [stocksCategoria]);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingItem(null);
    setNewItemImages(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditModal = (item: InventarioABCItem) => {
    setEditingItem(item);
    setFormData({
      categoria_id: String(item.categoria_id ?? ''),
      cantidad: String(item.cantidad ?? ''),
      nombre: item.nombre ?? '',
      marca: item.marca ?? '',
      modelo: item.modelo ?? '',
      descripcion: item.descripcion ?? '',
      estado_equipo: item.estado_equipo ?? '',
      ticket_asignacion: item.ticket_asignacion ?? '',
      solicitado_por: item.solicitado_por ?? '',
      observaciones: item.observaciones ?? '',
    });
    setNewItemImages(null);
    setIsFormOpen(true);
  };

  const openMovimientoModal = (item: InventarioABCItem) => {
    setSelectedItem(item);
    setMovimientoData({
      inventario_abc_id: item.inventario_abc_id,
      tipo_movimiento: 'entrada',
      cantidad: 1,
      numero_ticket: '',
      solicitado_por: '',
      comentario: '',
    });
    setIsMovimientoOpen(true);
  };

  const openStockModal = () => {
    const currentStock =
      selectedCategoria === 'Todas'
        ? stockGeneral.stock_total
        : stockSeleccionado?.stock_total ?? 0;

    setStockEditValue(String(currentStock));
    setIsStockOpen(true);
  };

  const handleSaveItem = async () => {
    try {
      setGuardandoForm(true);

      const payload = {
        categoria_id: Number(formData.categoria_id),
        cantidad: Number(formData.cantidad),
        nombre: formData.nombre.trim(),
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        descripcion: formData.descripcion.trim(),
        estado_equipo: formData.estado_equipo.trim(),
        ticket_asignacion: formData.ticket_asignacion.trim(),
        solicitado_por: formData.solicitado_por.trim(),
        observaciones: formData.observaciones.trim(),
      };

      const url = editingItem
        ? `${API_BASE}/inventario-abc/${editingItem.inventario_abc_id}`
        : `${API_BASE}/inventario-abc`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo guardar el artículo');
      }

      const inventarioId = editingItem
        ? editingItem.inventario_abc_id
        : data?.inventario_abc_id;

      if (inventarioId && newItemImages && newItemImages.length > 0) {
        const form = new FormData();

        Array.from(newItemImages).forEach((file) => {
          form.append('imagenes', file);
        });

        await fetch(`${API_BASE}/inventario-abc/${inventarioId}/imagenes`, {
          method: 'POST',
          body: form,
        });
      }

      setIsFormOpen(false);
      resetForm();
      await fetchInventario();
      await fetchStocksCategoria();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setGuardandoForm(false);
    }
  };

  const handleDeleteItem = async (item: InventarioABCItem) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${item.nombre}"?`)) return;

    try {
      const response = await fetch(
        `${API_BASE}/inventario-abc/${item.inventario_abc_id}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo eliminar');
      }

      await fetchInventario();
      await fetchStocksCategoria();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al eliminar');
    }
  };

  const handleSaveMovimiento = async () => {
    try {
      setGuardandoMovimiento(true);

      if (!movimientoData.inventario_abc_id) {
        throw new Error('Selecciona un artículo desde la tabla para registrar movimiento');
      }

      const response = await fetch(`${API_BASE}/inventario-abc/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo registrar el movimiento');
      }

      setIsMovimientoOpen(false);
      setMovimientoData(initialMovimiento);
      setSelectedItem(null);
      await fetchInventario();
      await fetchStocksCategoria();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al registrar movimiento');
    } finally {
      setGuardandoMovimiento(false);
    }
  };

  const openImagenesModal = async (item: InventarioABCItem) => {
    setSelectedItem(item);
    setIsImagenesOpen(true);
    setSelectedFiles(null);

    try {
      const response = await fetch(
        `${API_BASE}/inventario-abc/${item.inventario_abc_id}/imagenes`
      );

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setImagenes(data);
    } catch (error) {
      console.error(error);
      setImagenes([]);
    }
  };

  const openPrestamoModal = (item: InventarioABCItem) => {
  setSelectedItem(item);
  setPrestamoForm({
    ...initialPrestamoForm,
    fecha_asignacion: new Date().toISOString().slice(0, 16),
  });
  setIsPrestamoOpen(true);
};

const fetchPrestamos = async (item: InventarioABCItem) => {
  try {
    setLoadingPrestamos(true);
    setSelectedItem(item);

    const response = await fetch(
      `${API_BASE}/inventario-abc/${item.inventario_abc_id}/prestamos`
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    setPrestamos(data);
  } catch (error) {
    console.error(error);
    setPrestamos([]);
  } finally {
    setLoadingPrestamos(false);
  }
};

const openHistorialModal = async (item: InventarioABCItem) => {
  setIsHistorialOpen(true);
  await fetchPrestamos(item);
};

const handleCrearPrestamo = async () => {
  try {
    if (!selectedItem) throw new Error('No hay artículo seleccionado');

    setGuardandoPrestamo(true);

    const response = await fetch(
      `${API_BASE}/inventario-abc/${selectedItem.inventario_abc_id}/prestamos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitante_nombre: prestamoForm.solicitante_nombre.trim(),
          departamento: prestamoForm.departamento.trim(),
          cantidad: Number(prestamoForm.cantidad),
          estado_entrega: prestamoForm.estado_entrega,
          fecha_asignacion: prestamoForm.fecha_asignacion
            ? prestamoForm.fecha_asignacion.replace('T', ' ')
            : undefined,
          comentario: prestamoForm.comentario.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo registrar el préstamo');
    }

    alert(`Préstamo registrado: ${data.ticket_prestamo}`);

    setIsPrestamoOpen(false);
    setPrestamoForm(initialPrestamoForm);

    await fetchInventario();
    await fetchStocksCategoria();
  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : 'Error al registrar préstamo');
  } finally {
    setGuardandoPrestamo(false);
  }
};

const openDevolucionModal = (prestamo: PrestamoABC) => {
  setDevolucionForm({
    prestamo_id: prestamo.prestamo_id,
    estado_devolucion: 'Buen estado',
    detalle_devolucion: '',
    fecha_devolucion: new Date().toISOString().slice(0, 16),
  });
  setIsDevolucionOpen(true);
};

    const handleDevolverPrestamo = async () => {
    try {
        setGuardandoDevolucion(true);

        const response = await fetch(
        `${API_BASE}/inventario-abc/prestamos/${devolucionForm.prestamo_id}/devolver`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            estado_devolucion: devolucionForm.estado_devolucion,
            detalle_devolucion: devolucionForm.detalle_devolucion.trim(),
            fecha_devolucion: devolucionForm.fecha_devolucion
                ? devolucionForm.fecha_devolucion.replace('T', ' ')
                : undefined,
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data?.error || 'No se pudo devolver el préstamo');
        }

        setIsDevolucionOpen(false);
        setDevolucionForm(initialDevolucionForm);

        if (selectedItem) {
        await fetchPrestamos(selectedItem);
        }

        await fetchInventario();
        await fetchStocksCategoria();
    } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : 'Error al devolver préstamo');
    } finally {
        setGuardandoDevolucion(false);
    }
    };

  const handleUploadImages = async () => {
    if (!selectedItem || !selectedFiles || selectedFiles.length === 0) {
      alert('Selecciona al menos una imagen');
      return;
    }

    try {
      setSubiendoImagenes(true);

      const form = new FormData();

      Array.from(selectedFiles).forEach((file) => {
        form.append('imagenes', file);
      });

      const response = await fetch(
        `${API_BASE}/inventario-abc/${selectedItem.inventario_abc_id}/imagenes`,
        {
          method: 'POST',
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudieron subir las imágenes');
      }

      const reload = await fetch(
        `${API_BASE}/inventario-abc/${selectedItem.inventario_abc_id}/imagenes`
      );

      const reloadData = await reload.json();
      setImagenes(reloadData);
      setSelectedFiles(null);
      await fetchInventario();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al subir imágenes');
    } finally {
      setSubiendoImagenes(false);
    }
  };

  const handleDeleteImage = async (imagenId: number) => {
    if (!window.confirm('¿Eliminar esta imagen?') || !selectedItem) return;

    try {
      const response = await fetch(
        `${API_BASE}/inventario-abc/imagenes/${imagenId}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo eliminar la imagen');
      }

      const reload = await fetch(
        `${API_BASE}/inventario-abc/${selectedItem.inventario_abc_id}/imagenes`
      );

      const reloadData = await reload.json();
      setImagenes(reloadData);
      await fetchInventario();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al eliminar imagen');
    }
  };

  const handleSaveStock = async () => {
    try {
      setSavingStock(true);

      if (selectedCategoria === 'Todas') {
        throw new Error('Selecciona una categoría específica para editar su stock');
      }

      const categoriaId = stockSeleccionado?.categoria_id;

      if (!categoriaId) {
        throw new Error('No se encontró la categoría seleccionada');
      }

      const stockTotal = Number(stockEditValue);

      if (!Number.isInteger(stockTotal) || stockTotal < 0) {
        throw new Error('El stock debe ser un número válido');
      }

      const response = await fetch(`${API_BASE}/inventario-abc/stocks/${categoriaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_total: stockTotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo actualizar el stock');
      }

      setIsStockOpen(false);
      await fetchStocksCategoria();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error al actualizar stock');
    } finally {
      setSavingStock(false);
    }
  };

  const normalizarTexto = (value: unknown) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const obtenerValorFila = (row: Record<string, any>, posiblesClaves: string[]) => {
    const entries = Object.entries(row);

    for (const [key, value] of entries) {
      const normalizedKey = normalizarTexto(key);

      for (const clave of posiblesClaves) {
        if (normalizedKey === normalizarTexto(clave)) {
          return value;
        }
      }
    }

    return '';
  };

  const normalizarCategoriaExcel = (sheetName: string) => {
    const value = normalizarTexto(sheetName);

    if (value.includes('mouse')) return 'Mouse';
    if (value.includes('cable')) return 'Cables';
    if (value.includes('impresora')) return 'Impresoras';
    if (value.includes('teclado')) return 'Teclados';
    if (value.includes('monitor')) return 'Monitores';
    if (value.includes('ols')) return 'OLS';

    return 'Otros';
  };

  const obtenerCategoriaIdPorNombre = (nombre: string) => {
    const match = categorias.find(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );

    return match?.categoria_id ?? null;
  };

    const handleExcelFile = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });

        const rows: ExcelPreviewRow[] = [];

        const headersValidos = ['pzas', 'piezas', 'numero', 'número', 'nombre'];

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;

            const matriz = XLSX.utils.sheet_to_json<any[]>(sheet, {
            header: 1,
            defval: '',
            raw: false,
            });

            const categoriaDetectada = normalizarCategoriaExcel(sheetName);

            let headerIndex = -1;

            for (let i = 0; i < matriz.length; i++) {
            const fila = matriz[i].map((cell) => normalizarTexto(cell));

            const tieneEncabezado = fila.some((cell) =>
                headersValidos.includes(cell)
            );

            const tieneNombre = fila.includes('nombre');

            if (tieneEncabezado && tieneNombre) {
                headerIndex = i;
                break;
            }
            }

            if (headerIndex === -1) {
            console.warn(`No se encontró encabezado válido en hoja: ${sheetName}`);
            return;
            }

            const headers = matriz[headerIndex].map((h) => normalizarTexto(h));

            const getIndex = (posibles: string[]) =>
            headers.findIndex((h) => posibles.map(normalizarTexto).includes(h));

            const idxPzas = getIndex(['PZAS', 'Piezas', 'Numero', 'Número', 'Cant']);
            const idxNombre = getIndex(['Nombre', 'Marca']);
            const idxModelo = getIndex(['Modelo']);
            const idxDescripcion = getIndex(['Descripcion', 'Descripción']);
            const idxEstado = getIndex(['Estado del equipo', 'Estado']);
            const idxTicket = getIndex([
            'Ticket de Asignacion',
            'Ticket de Asignación',
            'Ticket',
            ]);

            for (let i = headerIndex + 1; i < matriz.length; i++) {
            const fila = matriz[i];

            const cantidad = Number(fila[idxPzas] || 0) || 0;
            const nombre = String(fila[idxNombre] ?? '').trim();
            const modelo = idxModelo >= 0 ? String(fila[idxModelo] ?? '').trim() : '';
            const descripcion =
                idxDescripcion >= 0 ? String(fila[idxDescripcion] ?? '').trim() : '';
            const estado =
                idxEstado >= 0 ? String(fila[idxEstado] ?? '').trim() : '';
            const ticket =
                idxTicket >= 0 ? String(fila[idxTicket] ?? '').trim() : '';

            if (!nombre && !modelo && !descripcion) continue;

            rows.push({
                categoria: categoriaDetectada,
                cantidad,
                nombre,
                marca: '',
                modelo,
                descripcion,
                estado_equipo: estado,
                ticket_asignacion: ticket,
                solicitado_por: '',
                observaciones: '',
            });
            }
        });

        setExcelPreview(rows);
        setIsImportOpen(true);
    };

  const handleConfirmImport = async () => {
    try {
      setImportandoExcel(true);

        let importados = 0;
        let omitidosDuplicado = 0;
        let omitidosStock = 0;
        let omitidosOtros = 0;

      for (const row of excelPreview) {
        const categoriaId = obtenerCategoriaIdPorNombre(row.categoria);

        if (!categoriaId) {
          omitidosOtros++;
          continue;
        }

        const response = await fetch(`${API_BASE}/inventario-abc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoria_id: categoriaId,
            cantidad: row.cantidad,
            nombre: row.nombre,
            marca: row.marca,
            modelo: row.modelo,
            descripcion: row.descripcion,
            estado_equipo: row.estado_equipo,
            ticket_asignacion: row.ticket_asignacion,
            solicitado_por: row.solicitado_por,
            observaciones: row.observaciones,
            auto_stock: true,
          }),
        });

        if (response.ok) {
        importados++;
        } else {
        const errorData = await response.json();
        const msg = (errorData?.error || '').toLowerCase();

        if (msg.includes('ya existe')) {
            omitidosDuplicado++;
        } else if (msg.includes('stock completo')) {
            omitidosStock++;
        } else {
            omitidosOtros++;
        }

        console.warn('Fila omitida:', row, errorData?.error);
        }
      }

      setIsImportOpen(false);
      setExcelPreview([]);
      await fetchInventario();
      await fetchStocksCategoria();

        alert(
            `Importación completada

            Nuevos importados: ${importados}
            Omitidos por duplicados: ${omitidosDuplicado}
            Omitidos por stock completo: ${omitidosStock}
            Otros omitidos: ${omitidosOtros}`
        );
    } catch (error) {
      console.error(error);
      alert('Error importando Excel');
    } finally {
      setImportandoExcel(false);
    }
  };

  const getEstadoBadgeClass = (estado?: string | null) => {
    const value = (estado ?? '').toLowerCase();

    if (value.includes('nuevo')) {
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }

    if (value.includes('usado')) {
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    }

    if (
      value.includes('no funciona') ||
      value.includes('dañado') ||
      value.includes('sin funcionar')
    ) {
      return 'bg-red-100 text-red-700 border border-red-200';
    }

    return 'bg-blue-100 text-blue-700 border border-blue-200';
  };

  const buildImageUrl = (ruta: string) => {
    const normalized = ruta.replace(/\\/g, '/');
    const fileName = normalized.split('/').pop();

    return `${API_BASE}/uploads/abc/${fileName}`;
  };

  const stockActualVista =
    selectedCategoria === 'Todas'
      ? stockGeneral
      : {
          stock_total: stockSeleccionado?.stock_total ?? 0,
          piezas_registradas: stockSeleccionado?.piezas_registradas ?? 0,
          stock_disponible: stockSeleccionado?.stock_disponible ?? 0,
        };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Inventario ABC</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Control manual de accesorios, refacciones y periféricos.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={openCreateModal}
                className="bg-white text-blue-700 hover:bg-blue-50 rounded-2xl px-5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar artículo
              </Button>

              <Button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="bg-white text-blue-700 hover:bg-blue-50 rounded-2xl px-5"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Excel
              </Button>

              <Button
                type="button"
                className="bg-white text-blue-700 hover:bg-blue-50 rounded-2xl px-5"
                onClick={() => {
                  fetchInventario();
                  fetchStocksCategoria();
                }}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Actualizar
              </Button>

              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleExcelFile(file);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {['Todas', ...categoriasUI].map((categoria) => (
            <button
              key={categoria}
              onClick={() => setSelectedCategoria(categoria)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition ${
                selectedCategoria === categoria
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">
              {selectedCategoria === 'Todas'
                ? 'Stock total en almacén'
                : `Stock en almacén - ${selectedCategoria}`}
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {loadingStocks ? '...' : stockActualVista.stock_total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">
              {selectedCategoria === 'Todas'
                ? 'Piezas registradas'
                : `Piezas registradas - ${selectedCategoria}`}
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {loadingStocks ? '...' : stockActualVista.piezas_registradas}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 mb-1">
                  {selectedCategoria === 'Todas'
                    ? 'Disponible'
                    : `Disponible - ${selectedCategoria}`}
                </p>
                <p
                  className={`text-3xl font-bold ${
                    Number(stockActualVista.stock_disponible) > 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {loadingStocks ? '...' : stockActualVista.stock_disponible}
                </p>
              </div>

              {selectedCategoria !== 'Todas' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={openStockModal}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Editar stock
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, marca, modelo, ticket o solicitado por..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-slate-200 bg-white"
              />
            </div>

            <div className="w-full lg:w-[250px]">
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
                <option value="Dañado">Dañado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="text-left px-5 py-4 text-sm font-semibold rounded-l-2xl">
                    Piezas
                  </th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Prestados</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Nombre</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Modelo</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Estado</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Ticket</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Foto</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold">Acciones</th>
                  <th className="rounded-r-2xl w-1" />
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.inventario_abc_id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    
                    <td className="px-5 py-4 text-sm font-semibold">{item.cantidad}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-yellow-700">
                    {Number(item.cantidad_prestada ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-sm">{item.nombre || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm">{item.modelo || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadgeClass(
                          item.estado_equipo
                        )}`}
                      >
                        {item.estado_equipo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {item.ticket_asignacion || 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {item.imagen_principal ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedImage(buildImageUrl(item.imagen_principal!))
                          }
                          className="block"
                        >
                          <img
                            src={buildImageUrl(item.imagen_principal)}
                            alt={item.nombre}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform"
                          />
                        </button>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px]">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => openEditModal(item)}
                        >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => openPrestamoModal(item)}
                        >
                            Prestar
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => openHistorialModal(item)}
                        >
                            Historial
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => openImagenesModal(item)}
                        >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Fotos
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteItem(item)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                        </Button>
                        </div>
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-14 text-slate-500">
              No se encontraron artículos que coincidan con la búsqueda
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-14 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando inventario...
            </div>
          )}
        </div>
      </div>

      <ModalasOfABC
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        categorias={categorias}
        guardandoForm={guardandoForm}
        handleSaveItem={handleSaveItem}
        setNewItemImages={setNewItemImages}
        isImagenesOpen={isImagenesOpen}
        setIsImagenesOpen={setIsImagenesOpen}
        imagenes={imagenes}
        setSelectedFiles={setSelectedFiles}
        subiendoImagenes={subiendoImagenes}
        handleUploadImages={handleUploadImages}
        handleDeleteImage={handleDeleteImage}
        buildImageUrl={buildImageUrl}
        isImportOpen={isImportOpen}
        setIsImportOpen={setIsImportOpen}
        excelPreview={excelPreview}
        importandoExcel={importandoExcel}
        handleConfirmImport={handleConfirmImport}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
        isMovimientoOpen={isMovimientoOpen}
        setIsMovimientoOpen={setIsMovimientoOpen}
        movimientoData={movimientoData}
        setMovimientoData={setMovimientoData}
        guardandoMovimiento={guardandoMovimiento}
        handleSaveMovimiento={handleSaveMovimiento}
        selectedItem={selectedItem}
        isStockOpen={isStockOpen}
        setIsStockOpen={setIsStockOpen}
        selectedCategoria={selectedCategoria}
        stockEditValue={stockEditValue}
        setStockEditValue={setStockEditValue}
        savingStock={savingStock}
        handleSaveStock={handleSaveStock}
        isPrestamoOpen={isPrestamoOpen}
        setIsPrestamoOpen={setIsPrestamoOpen}
        prestamoForm={prestamoForm}
        setPrestamoForm={setPrestamoForm}
        guardandoPrestamo={guardandoPrestamo}
        handleCrearPrestamo={handleCrearPrestamo}

        isHistorialOpen={isHistorialOpen}
        setIsHistorialOpen={setIsHistorialOpen}
        prestamos={prestamos}
        loadingPrestamos={loadingPrestamos}
        openDevolucionModal={openDevolucionModal}

        isDevolucionOpen={isDevolucionOpen}
        setIsDevolucionOpen={setIsDevolucionOpen}
        devolucionForm={devolucionForm}
        setDevolucionForm={setDevolucionForm}
        guardandoDevolucion={guardandoDevolucion}
        handleDevolverPrestamo={handleDevolverPrestamo}
      />
    </div>
  );
}