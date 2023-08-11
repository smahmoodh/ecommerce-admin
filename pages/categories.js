import React, {useState, useEffect} from 'react';
import axios from "axios";
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

import Layout from "@/components/Layout";

// const MySwal = withReactContent(Swal);
const Categories = () => {


    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    const saveCategory = async (e) => {
        e.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }

        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(
            ({name, values})=>({
                name,
                values: values.join(',')
            })))
    }
    const deleteCategory = (category) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#d55',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const {_id} = category;
                const res = await axios.delete('/api/categories?_id=' + _id)
                if (res) {
                    fetchCategories();
                    Swal.fire(`${category.name} deleted`, '', 'success');
                }
            }
        })
    }
    const addProperty = () => {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}]
        })
    }
    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }
    const removeProperty = (indexToRemove) => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            })
        })
    }
    return (
        <Layout>
            <h1>
                Categories
            </h1>
            <label>
                {
                    editedCategory ?
                        `Edit category ${editedCategory.name}` :
                        'Create new category'
                }
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Category name'
                    />
                    <select
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}
                    >
                        <option value="0">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id} key={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block'>Properties</label>
                    <button
                        type='button'
                        onClick={addProperty}
                        className="btn btn-default text-sm mb-2 ml-0">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className='flex gap-1 mb-2' key={index}>
                            <input type="text"
                                   className='mb-0'
                                   value={property.name}
                                   onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                                   placeholder='property name'
                            />
                            <input type="text"
                                   className='mb-0'
                                   value={property.values}
                                   onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}
                                   placeholder='values, comma seperated'/>
                            <button
                                type='button'
                                className="btn btn-red"
                                onClick={() => removeProperty(index)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                {editedCategory && (
                    <button
                        type='button'
                        onClick={() => {
                            setName('');
                            setParentCategory('');
                            setEditedCategory(null);
                            setProperties([]);
                        }}
                        className='btn btn-default'>
                        Cancel
                    </button>
                )}
                <button
                    type={'submit'}
                    className='btn btn-primary py-1'>
                    Save
                </button>
            </form>
            {!editedCategory && (
                <table className='basic mt-4'>
                    <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent category</td>
                        <td>Action</td>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className='flex gap-1'>
                                <button
                                    onClick={() => editCategory(category)}
                                    className='btn btn-primary'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>

                                </button>
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className='btn btn-red'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>

                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </Layout>
    )
}

export default Categories


