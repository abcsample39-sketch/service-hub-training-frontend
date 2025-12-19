import { AdminTabs } from '@/components/admin/AdminTabs';
import { Search } from 'lucide-react';

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        categoryId: '',
        image: ''
    });

    // ... fetchCategories and fetchServices (keep implementation) ...
    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:3001/services/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    }

    const fetchServices = async () => {
        try {
            const res = await fetch("http://localhost:3001/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data);
                setFilteredServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    // Filter services when search query changes
    useEffect(() => {
        if (!searchQuery) {
            setFilteredServices(services);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = services.filter(service =>
                service.name.toLowerCase().includes(lowerQuery) ||
                service.categoryName?.toLowerCase().includes(lowerQuery)
            );
            setFilteredServices(filtered);
        }
    }, [searchQuery, services]);

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch("http://localhost:3001/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration)
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', description: '', price: '', duration: '', categoryId: categories[0]?.id || '', image: '' });
                fetchServices();
            }
        } catch (error) {
            console.error("Failed to create service", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tight">Admin Panel</h1>
                <Button variant="outline" className="rounded-none border-2 border-black font-bold uppercase text-xs">
                    Main Site
                </Button>
            </div>

            {/* Navigation Tabs */}
            <AdminTabs />

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-black p-4 bg-white">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full h-10 border-2 border-gray-200 pl-10 pr-4 font-medium text-sm focus:outline-none focus:border-black transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white rounded-none uppercase font-bold text-xs h-10 w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
            </div>

            {/* Services Table */}
            <div className="bg-white border-2 border-t-0 border-black mt-[-2px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700 border-b-2 border-black">
                        <tr>
                            <th className="px-6 py-3">Service</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => (
                            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{service.name}</td>
                                <td className="px-6 py-4">
                                    <span className="border border-black rounded-full px-3 py-1 text-xs font-bold uppercase">
                                        {service.categoryName || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold">₹{service.price}</td>
                                <td className="px-6 py-4 font-bold flex items-center">
                                    {/* Using logic for rating if undefined, default to 0 in display */}
                                    {/* @ts-ignore - rating might not be in type yet if not updated locally */}
                                    {service.rating || '0.0'} ★
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="outline" className="h-8 w-8 border-2 border-black rounded-sm hover:bg-black hover:text-white transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-8 w-8 border-2 border-black rounded-sm hover:bg-red-600 hover:border-red-600 hover:text-white transition-all">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredServices.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No services found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 w-full max-w-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold uppercase">Add New Service</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreateService} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Service Name</label>
                                <input
                                    required
                                    className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Category</label>
                                <select
                                    className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Duration (mins)</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Image URL (Optional)</label>
                                <input
                                    type="url"
                                    className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                                <textarea
                                    className="w-full border-2 border-black p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white rounded-none uppercase font-bold h-10 hover:opacity-90">
                                Create Service
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
