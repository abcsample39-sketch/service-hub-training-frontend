                                    Save Address
                                </Button >
                            </div >
                        </div >
                    </div >
                )}

<div className="space-y-4">
    {addresses.length === 0 && !isAdding && (
        <p className="text-gray-500 font-medium italic">No addresses saved yet.</p>
    )}
    {addresses.map((addr) => (
        <div key={addr.id} className="flex justify-between items-start p-4 border-2 border-gray-100 hover:border-black transition-colors group">
            <div className="flex gap-3">
                <MapPin className="w-5 h-5 mt-1" />
                <div>
                    <div className="font-bold uppercase text-sm mb-1">{addr.label}</div>
                    <div className="text-gray-600">{addr.address}</div>
                </div>
            </div>
            {/* Potential delete button */}
            {/* <Button variant="ghost" size="icon" className="text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></Button> */}
        </div>
    ))}
</div>
            </div >
        </div >
    );
}
