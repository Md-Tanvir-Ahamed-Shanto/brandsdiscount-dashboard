import { useEffect, useState } from "react";
import { ALL_POSSIBLE_PUBLISHING_PLATFORMS, PRODUCT_STATUSES, SIZE_TYPES } from "../constants";
import { ArrowLeft, Layers, Plus, Save } from "lucide-react";

const ProductForm = ({ initialProductData, categoriesStructure, onSave, onCancel, currentUser }) => {
    const [formData, setFormData] = useState(null);
    const isWarehouseUploaderCreating = currentUser.role === 'WarehouseUploader' && !initialProductData;

    useEffect(() => {
        let defaultStatus = 'Active';
        if (currentUser.role === 'WarehouseUploader') { 
            defaultStatus = 'Draft';
        }

        const initialVariants = initialProductData?.variants?.map(v => ({...v, id: v.id || `var_${Date.now()}_${Math.random()}`})) || [];

        if (initialProductData) { // Editing existing product
            setFormData({
                ...initialProductData,
                status: currentUser.role === 'WarehouseUploader' ? 'Draft' : initialProductData.status || defaultStatus,
                listedOn: (initialProductData.listedOn || []).filter(pId => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some(fp => fp.id === pId)),
                variants: initialVariants,
                quantity: initialVariants.length > 0 ? initialVariants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0) : (initialProductData.quantity || 0),
            });
        } else { // Creating new product
            const baseData = {
                name: '', sku: '', brand: '',
                category: { parent: '', sub: '', type: '', typeId: '' },
                regularPrice: 0, salePrice: null, hasTenDollarOffer: true, offerPrice: 10.00,
                quantity: 0, imageUrl: '', listedOn: [],
                description: '', color: '', size: '', sizeType: '', itemLocation: '', condition: 'New',
                status: defaultStatus, dateAdded: new Date(),
                variants: [],
            };
            if (isWarehouseUploaderCreating) {
                setFormData({
                    name: '',
                    sku: '',
                    itemLocation: '',
                    quantity: 1, 
                    description: '',
                    imageUrl: '', 
                    brand: '', 
                    category: { parent: '', sub: '', type: '', typeId: '' },
                    regularPrice: null, salePrice: null, hasTenDollarOffer: false, offerPrice: null,
                    listedOn: [], 
                    color: '', size: '', sizeType: '', condition: 'New', 
                    status: 'Draft', 
                    dateAdded: new Date(),
                    variants: [],
                });
            } else {
                setFormData(baseData);
            }
        }
    }, [initialProductData, currentUser.role, isWarehouseUploaderCreating]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newFormData = { ...formData };

        if (name === "listedOn") {
            const currentListedOn = newFormData.listedOn || [];
            newFormData.listedOn = checked ? [...currentListedOn, value] : currentListedOn.filter(platform => platform !== value);
        } else if (name === "hasTenDollarOffer") {
            newFormData.hasTenDollarOffer = checked;
            newFormData.offerPrice = checked ? (newFormData.offerPrice && newFormData.offerPrice > 0 ? newFormData.offerPrice : 10.00) : null;
        } else if (["salePrice", "offerPrice", "regularPrice", "quantity"].includes(name)) {
            newFormData[name] = value === '' ? null : parseFloat(value);
        } else {
            newFormData[name] = type === 'checkbox' ? checked : value;
        }
        setFormData(newFormData);
    };
    
    const handleCategoryChange = (level, value) => {
        let newCategoryData = { ...formData.category };
        if (level === 'parent') { newCategoryData = { parent: value, sub: '', type: '', typeId: '' }; }
        else if (level === 'sub') { newCategoryData = { ...newCategoryData, sub: value, type: '', typeId: '' }; }
        else if (level === 'type') {
            const parentCat = categoriesStructure.find(p => p.parent === newCategoryData.parent);
            const subCat = parentCat?.subCategories.find(s => s.name === newCategoryData.sub);
            const typeDetails = subCat?.types.find(t => t.name === value);
            newCategoryData = { ...newCategoryData, type: value, typeId: typeDetails?.id || '' };
        }
        setFormData({ ...formData, category: newCategoryData });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = formData.variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, [field]: value };
            }
            return variant;
        });
        setFormData({ ...formData, variants: updatedVariants });
    };

    const addVariant = () => {
        const newVariant = {
            id: `var_${Date.now()}_${formData.variants.length}`, 
            color: '', sizeType: '', size: '', quantity: 0, skuSuffix: '', price: null
        };
        setFormData({ ...formData, variants: [...formData.variants, newVariant] });
    };

    const removeVariant = (index) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updatedVariants });
    };
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        let finalData = { ...formData };

        if (currentUser.role === 'WarehouseUploader') { 
            finalData.status = 'Draft'; 
            const allowedFieldsForSave = {
                name: finalData.name,
                sku: finalData.sku,
                itemLocation: finalData.itemLocation,
                quantity: Number(finalData.quantity) || 1, 
                description: finalData.description,
                imageUrl: finalData.imageUrl, 
                status: 'Draft', 
                brand: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.brand : '', 
                category: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.category : { parent: '', sub: '', type: '', typeId: '' },
                regularPrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.regularPrice : null,
                salePrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.salePrice : null,
                hasTenDollarOffer: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.hasTenDollarOffer : false,
                offerPrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.offerPrice : null,
                listedOn: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.listedOn : [], 
                color: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.color : '',
                size: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.size : '',
                sizeType: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.sizeType : '',
                condition: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.condition : 'New', 
                dateAdded: initialProductData?.dateAdded || new Date(), 
                variants: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.variants : [], 
            };
            finalData = allowedFieldsForSave;
        }
        
        if (finalData.variants && finalData.variants.length > 0 && currentUser.role !== 'WarehouseUploader') { 
            finalData.quantity = finalData.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
        }
        finalData.listedOn = (finalData.listedOn || []).filter(pId => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some(fp => fp.id === pId));
        onSave(finalData); 
    };

    if (!formData) return <div className="p-6 text-white">Loading product data...</div>;

    let platformsToDisplayInForm;
    if (!initialProductData) { // Creating a new product
        platformsToDisplayInForm = ALL_POSSIBLE_PUBLISHING_PLATFORMS.filter(p => p.id === 'ebay1' || p.id === 'ebay2' || p.id === 'ebay3');
    } else { // Editing an existing product
        platformsToDisplayInForm = ALL_POSSIBLE_PUBLISHING_PLATFORMS;
    }

    const parentCategoryOptions = categoriesStructure.map(p => p.parent);
    const subCategoryOptions = formData.category?.parent ? categoriesStructure.find(p => p.parent === formData.category.parent)?.subCategories.map(s => s.name) || [] : [];
    const typeCategoryOptions = formData.category?.sub ? categoriesStructure.find(p => p.parent === formData.category.parent)?.subCategories.find(s => s.name === formData.category.sub)?.types.map(t => t.name) || [] : [];
    
    const canChangeStatus = currentUser.role !== 'WarehouseUploader'; 
    const hasVariants = formData.variants && formData.variants.length > 0;


    return (
        <div className="p-4 md:p-6 text-gray-300">
            <button onClick={onCancel} className="mb-6 flex items-center text-indigo-400 hover:text-indigo-300">
                <ArrowLeft size={20} className="mr-2"/> Back to Products
            </button>
            <h2 className="text-2xl font-semibold text-white mb-6">{initialProductData ? "Edit Product" : "Create New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Product Name */}
                <div><label className="block text-sm font-medium">Product Name*</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                
                {/* SKU & Item Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium">SKU*</label><input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                    <div><label className="block text-sm font-medium">Item Location</label><input type="text" name="itemLocation" value={formData.itemLocation} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                </div>

                {/* Quantity */}
                 <div>
                    <label className="block text-sm font-medium">Total Quantity*</label>
                    <input 
                        type="number" 
                        name="quantity" 
                        value={isWarehouseUploaderCreating ? formData.quantity : (hasVariants ? formData.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0) : formData.quantity)} 
                        onChange={handleChange} 
                        min="0" 
                        required 
                        className="mt-1 block w-full bg-gray-700 p-2 rounded" 
                        disabled={!isWarehouseUploaderCreating && hasVariants} 
                        title={!isWarehouseUploaderCreating && hasVariants ? "Total quantity is sum of variants" : "Enter quantity"} 
                    />
                    {!isWarehouseUploaderCreating && hasVariants && <p className="text-xs text-gray-400 mt-1">Total quantity is sum of variants.</p>}
                </div>
                
                {/* Description */}
                <div><label className="block text-sm font-medium">Description {isWarehouseUploaderCreating && '(Optional)'}</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full bg-gray-700 p-2 rounded"></textarea></div>
                
                {/* Image URL (Visible for WarehouseUploader on create) */}
                 {(isWarehouseUploaderCreating || !initialProductData || currentUser.role !== 'WarehouseUploader') && ( 
                    <fieldset className="border border-gray-700 p-4 rounded-md">
                        <legend className="text-sm font-medium px-2 text-gray-400">Image</legend>
                        <div><label className="block text-sm font-medium">Primary Image URL</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                    </fieldset>
                )}


                {/* Fields hidden for WarehouseUploader when creating new product */}
                {!isWarehouseUploaderCreating && (
                    <>
                        {/* Brand */}
                        <div><label className="block text-sm font-medium">Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                        
                        {/* Categorization */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Categorization</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium">Parent Category*</label><select name="category.parent" value={formData.category?.parent || ''} onChange={(e) => handleCategoryChange('parent', e.target.value)} required className="mt-1 block w-full bg-gray-700 p-2 rounded"><option value="">Select Parent</option>{parentCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Sub Category*</label><select name="category.sub" value={formData.category?.sub || ''} onChange={(e) => handleCategoryChange('sub', e.target.value)} required disabled={!formData.category?.parent} className="mt-1 block w-full bg-gray-700 p-2 rounded disabled:opacity-50"><option value="">Select Sub</option>{subCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Type*</label><select name="category.type" value={formData.category?.type || ''} onChange={(e) => handleCategoryChange('type', e.target.value)} required disabled={!formData.category?.sub} className="mt-1 block w-full bg-gray-700 p-2 rounded disabled:opacity-50"><option value="">Select Type</option>{typeCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                        </fieldset>
                        
                        {/* Default/Base Sizing & Color */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Default/Base Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium">Default Color</label><input type="text" name="color" value={formData.color} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                                <div>
                                    <label className="block text-sm font-medium">Default Size Type</label>
                                    <select name="sizeType" value={formData.sizeType} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded">
                                        <option value="">Select Size Type</option>
                                        {SIZE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Default Custom Size</label>
                                    <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g., 28W, 10.5, Tall" className="mt-1 block w-full bg-gray-700 p-2 rounded"/>
                                </div>
                            </div>
                        </fieldset>

                        {/* Pricing */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Pricing</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div><label className="block text-sm font-medium">Regular Price*</label><input type="number" name="regularPrice" value={formData.regularPrice || ''} onChange={handleChange} step="0.01" min="0" required className="mt-1 block w-full bg-gray-700 p-2 rounded" /></div>
                                <div><label className="block text-sm font-medium">Sale Price</label><input type="number" name="salePrice" value={formData.salePrice === null ? '' : formData.salePrice} onChange={handleChange} step="0.01" min="0" className="mt-1 block w-full bg-gray-700 p-2 rounded" /></div>
                                <div className="flex flex-col">
                                    <label htmlFor="hasTenDollarOffer" className="flex items-center text-sm font-medium mb-1">
                                        <input type="checkbox" id="hasTenDollarOffer" name="hasTenDollarOffer" checked={formData.hasTenDollarOffer} onChange={handleChange} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-800 border-gray-500 rounded mr-2"/>
                                        Enable $10 Offer
                                    </label>
                                    <input type="number" name="offerPrice" value={formData.offerPrice === null ? '' : formData.offerPrice} onChange={handleChange} step="0.01" min="0" disabled={!formData.hasTenDollarOffer} placeholder="Offer Price (e.g., 10.00)" className="block w-full bg-gray-700 p-2 rounded disabled:opacity-50" />
                                </div>
                            </div>
                        </fieldset>
                        
                        {/* Condition & Status */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium">Condition</label><select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"><option>New</option><option>Used - Like New</option></select></div>
                            <div>
                                <label className="block text-sm font-medium">Product Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} disabled={!canChangeStatus} className={`mt-1 block w-full bg-gray-700 p-2 rounded ${!canChangeStatus ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {PRODUCT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* Variations Section */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400 flex items-center"><Layers size={16} className="mr-1"/> Product Variations</legend>
                            {formData.variants && formData.variants.map((variant, index) => (
                                <div key={variant.id || index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 p-3 border border-gray-600 rounded-md relative">
                                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300" title="Remove Variant"><XCircle size={18}/></button>
                                    <div><label className="block text-xs">Color*</label><input type="text" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} required className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Size Type*</label><select value={variant.sizeType} onChange={e => handleVariantChange(index, 'sizeType', e.target.value)} required className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm"><option value="">Select</option>{SIZE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}</select></div>
                                    <div><label className="block text-xs">Custom Size</label><input type="text" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Quantity*</label><input type="number" value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)} required min="0" className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">SKU Suffix</label><input type="text" value={variant.skuSuffix} onChange={e => handleVariantChange(index, 'skuSuffix', e.target.value)} placeholder={`${variant.color.substring(0,2).toUpperCase()}-${variant.sizeType.substring(0,1)}`} className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Variant Price</label><input type="number" step="0.01" value={variant.price === null ? '' : variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="Main Price" className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                </div>
                            ))}
                            <button type="button" onClick={addVariant} className="mt-2 text-indigo-400 hover:text-indigo-300 flex items-center text-sm"><Plus size={18} className="mr-1"/> Add Variant</button>
                        </fieldset>

                        {/* Publish On */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Publish On</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {platformsToDisplayInForm.map(platform => (<label key={platform.id} className="flex items-center space-x-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 cursor-pointer"><input type="checkbox" name="listedOn" value={platform.id} checked={(formData.listedOn || []).includes(platform.id)} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-800 border-gray-500 rounded focus:ring-indigo-500"/><span>{platform.name}</span></label>))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Product is also published on your main "Website" if Status is 'Active'.</p>
                        </fieldset>
                    </>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md shadow-sm">Cancel</button>
                    <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm flex items-center"><Save size={18} className="mr-2"/> {initialProductData ? "Save Changes" : "Create Product"}</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;